import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { getPost } from "blog-content/bundler.db";
import { useMemo } from "react";
import invariant from "tiny-invariant";

export const loader = async function ({ params, request }: LoaderArgs) {
  const { slug } = params;
  invariant(typeof slug === "string", "Missing slug");
  const post = await getPost(new URL(request.url).origin, slug);
  invariant(post !== undefined, "Could not find post");
  return json({ post });
};

export default function BlogSlugRoute() {
  const { post } = useLoaderData<typeof loader>();
  const { title } = post.frontmatter;
  const { code } = post;
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <div className="container prose mx-auto py-8">
      <h1>{title}</h1>
      <Component />
    </div>
  );
}
