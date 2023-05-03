export interface PostFrontMatter {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  tags?: string[];
}

export interface PostFrontMatterWithSlug extends PostFrontMatter {
  slug: string;
}

export type PostFrontMatterCollection = PostFrontMatterWithSlug[];
