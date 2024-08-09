import path from "path";
import { bundleMDX as bundle } from "mdx-bundler";
import type { BundleMDXSource } from "mdx-bundler/dist/types";
import remarkMdxImages from "remark-mdx-images";
import type { PostFrontMatter } from "./models";

// https://github.com/kentcdodds/mdx-bundler/blob/main/README.md#nextjs-esbuild-enoent
if (process.platform === "win32") {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "esbuild.exe"
  );
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "bin",
    "esbuild"
  );
}

export type Mdx = Awaited<ReturnType<typeof bundleMdx>>;

export async function bundleMdx(
  content: string,
  slug: string,
  cwd: string,
  files?: BundleMDXSource<PostFrontMatter>["files"]
) {
  const { code, frontmatter } = await bundle<PostFrontMatter>({
    source: content,
    files,
    cwd,
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
