import { bundleMDX } from "mdx-bundler";
/**
 * Not super proud of this ESM workaround, but it's the only thing
 * that would allow images to be used in blog posts.
 */
const remarkMdxImages = require("fix-esm").require("remark-mdx-images");

interface PostFrontMatter extends Record<string, any> {
  title: string;
  date: string;
  author: string;
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
    cwd: `${__dirname}/posts`,
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkMdxImages,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".png": "dataurl",
        ".jpg": "dataurl",
        ".jpeg": "dataurl",
      };
      return options;
    },
  });
  return {
    code,
    frontmatter,
    slug,
  };
}
