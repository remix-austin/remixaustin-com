import { bundleMDX } from "mdx-bundler";

interface PostFrontMatter extends Record<string, any> {
  title: string;
  date: string;
  tags: string[];
}

export type Mdx = Awaited<ReturnType<typeof parseMdx>>;

export async function parseMdx(
  content: Buffer,
  slug: string,
  files?: Parameters<typeof bundleMDX>[0]["files"]
) {
  const { code, frontmatter } = await bundleMDX<Partial<PostFrontMatter>>({
    source: content.toString("utf-8"),
    files,
  });
  return {
    code,
    frontmatter,
    slug,
  };
}
