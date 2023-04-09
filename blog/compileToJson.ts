import path from "path";
import fs from "fs";
import { parseMdx } from "./parser";
import { COMPONENT_DIR, POST_DIR } from "./paths";

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

async function readMdxFile(filename: string, comps?: Record<string, string>) {
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

export async function compilePostsToJson() {
  const comps = readComponents();
  const postFileNames = fs
    .readdirSync(POST_DIR)
    .filter(isMarkdownFilename)
    .map((name) => path.join(POST_DIR, name));
  const content = await Promise.all(
    postFileNames.map((filename) => readMdxFile(filename, comps))
  );
  return JSON.stringify(content, null, 2);
}
