import path from "path";
import fs from "fs";
import { parseMdx } from "./bundler";
import {
  POST_CACHE_DIR_DEV,
  POST_CACHE_FILEPATH_DEV,
  POST_CACHE_FILEPATH_PROD,
} from "./bundler.db";

const POST_DIR = path.join(__dirname, ".", "posts");
const COMPONENT_DIR = path.join(POST_DIR, "components");

function readComponents() {
  if (!fs.existsSync(COMPONENT_DIR)) {
    return undefined;
  }
  return fs
    .readdirSync(COMPONENT_DIR)
    .filter(isTypescriptFilename)
    .map((filename) => path.join(COMPONENT_DIR, filename))
    .reduce((componentFiles, file) => {
      const relativePath = path.relative(POST_DIR, file);
      const content = fs.readFileSync(file).toString("utf-8");
      return { ...componentFiles, [relativePath]: content };
    }, {} as Record<string, string>);
}

function readMdxFile(filename: string, comps?: Record<string, string>) {
  const slug = path.basename(filename, path.extname(filename));
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filename, (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  }).then((content) => parseMdx(content, slug, comps));
}

function isTypescriptFilename(filename: string | undefined) {
  return (
    filename !== undefined &&
    (filename.endsWith("ts") || filename.endsWith("tsx"))
  );
}

function isMarkdownFilename(filename: unknown): filename is "*md" | "*mdx" {
  return (
    typeof filename === "string" &&
    (filename.endsWith("md") || filename.endsWith("mdx"))
  );
}

async function writePostCache(postCacheFilepath: string) {
  const comps = readComponents();
  const postFileNames = fs
    .readdirSync(POST_DIR)
    .filter(isMarkdownFilename)
    .map((name) => path.join(POST_DIR, name));
  const content = await Promise.all(
    postFileNames.map((filename) => readMdxFile(filename, comps))
  );
  fs.writeFileSync(postCacheFilepath, JSON.stringify(content, null, 2));
  console.log("Wrote", path.relative(__dirname, postCacheFilepath));
}

(async () => {
  if (
    process.env.NODE_ENV === "development" &&
    !fs.existsSync(POST_CACHE_DIR_DEV)
  ) {
    fs.mkdirSync(POST_CACHE_DIR_DEV);
  }
  const postCacheFilepath =
    process.env.NODE_ENV === "development"
      ? POST_CACHE_FILEPATH_DEV
      : POST_CACHE_FILEPATH_PROD;
  await writePostCache(postCacheFilepath);
  if (process.env.NODE_ENV === "development") {
    fs.watch(POST_DIR, (event, filename) => {
      if (isMarkdownFilename(filename)) {
        writePostCache(postCacheFilepath);
      }
    });
  }
})();
