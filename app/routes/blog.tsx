import { Link, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunction } from "@remix-run/server-runtime";

interface BlogPost {
  id: string;
  title: string;
  teaser: string;
  content: string;
  slug: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: Connect to Strapi content
  const posts: BlogPost[] = Array(5)
    .fill(null)
    .map((_, index) => ({
      id: `post-${index}`,
      title: `Article ${index + 1}`,
      teaser: "Lorem ipsum, dolor sit amet consectetur adipisicing elit...",
      content:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus in qui porro quia neque, animi illo, vero sed, nulla minus ut facilis laborum. Suscipit nam at nemo, quas dolor ut!",
      slug: `article-${index + 1}`,
    }));

  return json({ posts });
};

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="container prose mx-auto py-8">
      <h1>Blog</h1>
      <ul className="list-none pl-0">
        {posts.map((post: BlogPost) => (
          <li key={post.id} className="pl-0">
            <Link to={`/blog/${post.slug}`}>
              <h3 className="mb-4 text-2xl font-bold">{post.title}</h3>
            </Link>
            <p>{post.teaser}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
