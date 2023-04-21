import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { PUBLISH_DATE_FORMATTER } from "~/utils";
import { type Mdx } from "blog/parser";

export const loader = async function ({ params, request }: LoaderArgs) {
  const { slug } = params;
  invariant(typeof slug === "string", "Missing slug");
  const post = (await fetch(
    `${new URL(request.url).origin}/resource/get-blog-post/${slug}`
  ).then((response) => response.json())) as Promise<Mdx>;
  invariant(post !== undefined, "Could not find post");
  return post;
};

export default function BlogSlugRoute() {
  const post = useLoaderData<typeof loader>();
  const { title, author, date } = post.frontmatter;
  const { code } = post;
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <div className="container prose mx-auto px-4 py-8 md:px-0">
      <h1 className="mb-[0px]">{title}</h1>
      {author && (
        <h4 className={`mt-4${date ? " mb-[0px]" : ""}`}>By {author}</h4>
      )}
      {date && (
        <h5 className="mb-2">
          {PUBLISH_DATE_FORMATTER.format(new Date(date))}
        </h5>
      )}
      <Component />
    </div>
  );
}
