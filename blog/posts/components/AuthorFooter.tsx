import { type ReactNode } from "react";

/**
 * Using `contents` here instead of `children` because of a weird bug
 * with nesting children in `mdx-bundler`. Our prettier auto-format
 * kept making it bug out too. Super weird stuff.
 */
export function AuthorFooter({
  imageSrc,
  alt,
  contents,
}: {
  imageSrc: string;
  alt: string;
  contents: ReactNode;
}) {
  return (
    <div className="flex flex-row items-center">
      <img className="h-48 w-48 rounded-full" src={imageSrc} alt={alt} />
      <p className="ml-4 flex-1">{contents}</p>
    </div>
  );
}
