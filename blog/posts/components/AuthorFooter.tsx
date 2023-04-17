import type { PropsWithChildren } from "react";

export function AuthorFooter({
  imageSrc,
  alt,
  children,
}: {
  imageSrc: string;
  alt: string;
} & PropsWithChildren) {
  return (
    <div className="flex flex-row items-center">
      <img className="h-40 w-40 rounded-full" src={imageSrc} alt={alt} />
      <div className="ml-4 flex-1">{children}</div>
    </div>
  );
}
