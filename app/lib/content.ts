import frontmatter from "front-matter";
import { parse } from "path-esm";
import type { ReactNode } from "react";
import type { Output } from "valibot";
import { parse as validate } from "valibot";
import { collections } from "~/content/config";
import type { MDXProps } from "mdx/types";

type MDXComponent = (props: MDXProps) => ReactNode;

export type Content<Data, Collection> = {
  collection: Collection;
  slug: string;
  body: string;
  data: Data;
};

export type Collecitons = typeof collections;
export type CollectionKey = keyof Collecitons;

const collectionFiles = import.meta.glob<{ default: MDXComponent }>(
  "/app/content/**/*.{md,mdx}",
  {
    eager: true,
  },
);

const collectionFilesRaw = import.meta.glob("/app/content/**/*.{md,mdx}", {
  eager: true,
  as: "raw",
});

export function getCollection<Collection extends CollectionKey>(
  collection: Collection,
): {
  collection: Collection;
  slug: string;
  content: MDXComponent;
  data: Output<Collecitons[Collection]>;
}[] {
  return Object.entries(collectionFiles)
    .filter(([path]) => {
      const contentDir = parse(parse(path).dir).name;
      return contentDir === collection;
    })
    .map(([path, module]) => {
      let file = collectionFilesRaw[path];
      let { attributes } = frontmatter(file);
      let data = validate(collections[collection], attributes);
      return {
        slug: parse(path).name,
        content: module.default,
        data,
        collection,
      };
    });
}
