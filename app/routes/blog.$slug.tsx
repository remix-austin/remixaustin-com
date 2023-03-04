import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  // TODO: Connect to Strapi content
  const content = Array(5)
    .fill(
      "<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus in qui porro quia neque, animi illo, vero sed, nulla minus ut facilis laborum. Suscipit nam at nemo, quas dolor ut!</p>"
    )
    .join("");

  return json({
    post: {
      // @ts-ignore
      title: `Article ${params.slug.slice(-1)}`,
      teaser: "Lorem ipsum, dolor sit amet consectetur adipisicing elit...",
      content,
      slug: params.slug,
    },
  });
};

export default function BlogSlugRoute() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="container prose mx-auto py-8">
      <h1>{post.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
