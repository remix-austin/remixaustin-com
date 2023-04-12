import fs from "fs";
import path from "path";

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
