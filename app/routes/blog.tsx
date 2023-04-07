import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/server-runtime";
import { Mdx } from "blog-content/bundler";
import { getPosts } from "blog-content/bundler.db";
import { publishDateFormatter } from "~/utils";

export const loader = async function ({ request }: LoaderArgs) {
  const posts = await getPosts(new URL(request.url).origin);
  return json({
    posts: posts.map(({ slug, frontmatter }) => ({ slug, frontmatter })),
  });
};

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="container prose mx-auto py-8">
      <h1>Blog</h1>
      <ul className="list-none pl-0">
        {posts.map(
          (
            {
              slug,
              frontmatter: { title, date },
            }: Pick<Mdx, "slug" | "frontmatter">,
            index: number
          ) => (
            <li key={`${title}-${index}`} className="pl-0">
              <Link to={`/blog/${slug}`}>
                <h3 className="mb-4 text-2xl font-bold">{title}</h3>
                {date && <h4>{publishDateFormatter.format(new Date(date))}</h4>}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
