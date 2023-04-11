import { bundleMDX } from "mdx-bundler";
import type { BundleMDXSource } from "mdx-bundler/dist/types";
import type { PostFrontMatter } from "./models";
import { POSTS_BUILD_DIR } from "./pathsBuild";
/**
 * Not super proud of this ESM workaround, but it's the only thing
 * that would allow images to be used in blog posts.
 */
const remarkMdxImages = require("fix-esm").require("remark-mdx-images");

export type Mdx = Awaited<ReturnType<typeof parseMdx>>;

export async function parseMdx(
  content: string,
  slug: string,
  files?: BundleMDXSource<PostFrontMatter>["files"]
) {
  const { code, frontmatter } = await bundleMDX<PostFrontMatter>({
    source: content,
    files,
    cwd: POSTS_BUILD_DIR,
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
