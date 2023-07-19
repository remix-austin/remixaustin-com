import type { HeadersFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { PUBLISH_DATE_FORMATTER } from "~/utils";
import type { Mdx } from "blog/parser.server";

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

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }
  const {
    frontmatter: { title, author, date, imageUrl, imageAlt, description, tags },
  } = data.post;
  const origin = new URL(data.url).origin;
  return [
    { title },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:url",
      content: data.url,
    },
    {
      name: "og:type",
      content: "article",
    },
    {
      name: "og:author",
      content: author,
    },
    {
      name: "og:published_time",
      content: new Date(date).toISOString(),
    },
    {
      name: "og:title",
      content: title,
    },
    {
      name: "og:description",
      content: description,
    },
    {
      name: "og:image",
      content: imageUrl[0] === "/" ? `${origin}${imageUrl}` : imageUrl,
    },
    {
      name: "og:image:alt",
      content: imageAlt,
    },
    {
      name: "og:image:type",
      content: "image/jpeg",
    },
    {
      name: "og:image:width",
      content: "1200",
    },
    {
      name: "og:image:height",
      content: "630",
    },
    {
      name: "twitter:image",
      content: imageUrl[0] === "/" ? `${origin}${imageUrl}` : imageUrl,
    },
    {
      name: "twitter:image:alt",
      content: imageAlt,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      name: "twitter:title",
      content: title,
    },
    ...(tags
      ? tags.map((tag) => ({
          name: "article:tag",
          content: tag,
        }))
      : []),
  ];
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
