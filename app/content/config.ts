import * as v from "valibot";

const blogCollection = v.object({
  title: v.string(),
  date: v.date(),
  author: v.string(),
  description: v.string(),
  imageUrl: v.string([]),
  imageAlt: v.string(),
  tags: v.array(v.string()),
});

export const collections = {
  blog: blogCollection,
};
