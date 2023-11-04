import type {
  HeadersFunction,
  MetaFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { getCollection } from "~/lib/content";
import { PUBLISH_DATE_FORMATTER } from "~/utils";

export const SHORT_CACHE_MAX_AGE = `max-age=28800`; // 8 hour cache
export const LONG_CACHE_MAX_AGE = `max-age=604800`; // One week cache

const COLLECTION = getCollection("blog");

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

export const loader = async function ({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(typeof slug === "string", "Missing slug");
  const post = COLLECTION.find((c) => c.slug === slug);
  invariant(post !== undefined, "Could not find post");
  return json(
    {
      slug,
      frontmatter: post.data,
      url: request.url,
    },
    {
      headers: buildHeaders(post.data.date),
    },
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") ?? "no-cache",
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }
  const { title, author, date, imageUrl, imageAlt, description, tags } =
    data.frontmatter;
  const origin = new URL(data.url).origin;
  return [
    { charSet: "utf-8" },
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
      ? tags.map((tag: any) => ({
          name: "article:tag",
          content: tag,
        }))
      : []),
  ];
};

export default function BlogSlugRoute() {
  const { slug, frontmatter } = useLoaderData<typeof loader>();
  const { title, author, date, imageUrl, imageAlt } = frontmatter;
  const Content = useMemo(
    // We can force unwrap this entry because if it doesn't exist, we will throw
    // in the loader before we even render this component
    () => COLLECTION.find((c) => c.slug === slug)!.content,
    [slug],
  );

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
      <Content />
    </div>
  );
}
