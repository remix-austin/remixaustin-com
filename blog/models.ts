export interface PostFrontMatter extends Record<string, any> {
  title: string;
  date: string;
  author: string;
  tags: string[];
}
export type PostFrontMatterGroup = [string, PostFrontMatter];
export type PostFrontMatterCollection = PostFrontMatterGroup[];
