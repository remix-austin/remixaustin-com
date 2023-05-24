import type { HeadersFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { PUBLISH_DATE_FORMATTER } from "~/utils";
import type { Mdx } from "blog/parser";

export const SHORT_CACHE_MAX_AGE = `max-age=28800`; // 8 hour cache
export const LONG_CACHE_MAX_AGE = `max-age=604800`; // One week cache

function buildHeaders(publishDate: Date): HeadersInit | undefined {
  if (process.env.NODE_ENV === "development") {
    return undefined;
  }
  const nowMs = Date.now();
  const difference = nowMs - publishDate.getTime();
  const differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24));
  return {
    "Cache-Control":
      differenceInDays < 4 ? SHORT_CACHE_MAX_AGE : LONG_CACHE_MAX_AGE,
  };
}

export const loader = async function ({ params, request }: LoaderArgs) {
  const { slug } = params;
  invariant(typeof slug === "string", "Missing slug");
  const post = await fetch(
    `${new URL(request.url).origin}/resource/get-blog-post/${slug}`
  ).then((response) => response.json() as Promise<Mdx>);
  invariant(post !== undefined, "Could not find post");
  invariant(post.frontmatter.date !== undefined, "Post has no publish date");
  return json(
    {
      post,
      url: request.url,
    },
    {
      headers: buildHeaders(new Date(post.frontmatter.date)),
    }
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") ?? "no-cache",
});

/**
 * TODO: When we update to Remix v2, we need to change this function according to this
 * page in the docs: https://remix.run/docs/en/1.16.0/pages/v2#route-meta
 * Blog tags can't be added to meta in Remix v1. We need to wait until v2.
 */
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const {
    frontmatter: { title, author, date, imageUrl, imageAlt, description },
  } = data.post;
  const origin = new URL(data.url).origin;
  return {
    title,
    description,
    "og:url": data.url,
    "og:type": "article",
    "og:author": author,
    "og:published_time": new Date(date).toISOString(),
    "og:title": title,
    "og:description": description,
    "og:image": imageUrl[0] === "/" ? `${origin}${imageUrl}` : imageUrl,
    "og:image:alt": imageAlt,
    "og:image:type": "image/jpeg",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:image": imageUrl[0] === "/" ? `${origin}${imageUrl}` : imageUrl,
    "twitter:image:alt": imageAlt,
    "twitter:description": description,
    "twitter:title": title,
  };
};

export default function BlogSlugRoute() {
  const { post } = useLoaderData<typeof loader>();
  const { title, author, date, imageUrl, imageAlt } = post.frontmatter;
  const { code } = post;
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <div className="container prose mx-auto px-4 py-8 text-justify md:px-0">
      <h1 className="mb-[0px]">{title}</h1>
      {author && (
        <h2 className={`mt-4${date ? " mb-[0px]" : ""}`}>By {author}</h2>
      )}
      {date && (
        <h3 className="mb-2">
          {PUBLISH_DATE_FORMATTER.format(new Date(date))}
        </h3>
      )}
      <img
        className="mt-4 w-full object-contain"
        src={imageUrl}
        alt={imageAlt}
      />
      <Component />
    </div>
  );
}
