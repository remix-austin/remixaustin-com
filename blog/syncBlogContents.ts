import fs from "fs";
import path from "path";
import { POSTS_SOURCE_DIR } from "./pathsBuild";
import { POSTS_BUILD_DIR } from "./pathsBuild";

export function copyAllPostContent(src: string, dest: string) {
  const exists = fs.existsSync(src);
  if (!exists) {
    return;
  }
  const stats = fs.lstatSync(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyAllPostContent(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function copyOnePostFile(src: string) {
  const exists = fs.existsSync(src);
  if (!exists) {
    return;
  }
  const relativePath = path.relative(POSTS_SOURCE_DIR, src);
  const absolutePath = path.join(POSTS_BUILD_DIR, relativePath);
  fs.writeFileSync(absolutePath, fs.readFileSync(src), "utf-8");
}

export function deleteOnePostFile(src: string) {
  const relativePath = path.relative(POSTS_SOURCE_DIR, src);
  const absolutePath = path.join(POSTS_BUILD_DIR, relativePath);
  fs.unlinkSync(absolutePath);
}
