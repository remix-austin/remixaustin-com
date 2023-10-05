import { Link, useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import type { PostFrontMatterCollection } from "blog/models";
import { PUBLISH_DATE_FORMATTER } from "~/utils";

export const loader = async function ({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  return fetch(`${origin}/resource/get-all-front-matter`).then((response) =>
    response.json()
  ) as Promise<PostFrontMatterCollection>;
};

export default function BlogRoute() {
  const frontMatterArray = useLoaderData<typeof loader>();
  return (
    <div className="container prose mx-auto py-8">
      <h1>Blog</h1>
      <ul className="list-none pl-0">
        {frontMatterArray.map(
          ({ slug, title, date, author }, index: number) => (
            <li key={`${title}-${index}`} className="pl-0">
              <Link to={`/blog/${slug}`}>
                <h2 className="mb-4 text-2xl font-bold">{title}</h2>
                {(author || date) && (
                  <h3>
                    {author}
                    {author && date && " - "}
                    {date && PUBLISH_DATE_FORMATTER.format(new Date(date))}
                  </h3>
                )}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
