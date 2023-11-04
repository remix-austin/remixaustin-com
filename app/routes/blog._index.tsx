import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { PUBLISH_DATE_FORMATTER } from "~/utils";
import { getCollection } from "~/lib/content";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const requestUrl = new URL(request.url);
  const pageNumber = Number(requestUrl.searchParams.get("page") ?? 1); // Page number is 1 based, not 0 based
  const pageSize = Number(requestUrl.searchParams.get("pageSize") ?? 10);

  const collection = getCollection("blog");

  const start = (pageNumber - 1) * pageSize;
  const end = pageNumber * pageSize;

  return json(collection.slice(start, end));
};

export default function BlogRoute() {
  const frontMatterArray = useLoaderData<typeof loader>();
  return (
    <div className="container prose mx-auto py-8">
      <h1>Blog</h1>
      <ul className="list-none pl-0">
        {frontMatterArray.map(
          ({ slug, data: { title, date, author } }, index: number) => (
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
          ),
        )}
      </ul>
    </div>
  );
}
