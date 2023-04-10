import { PropsWithChildren } from "react";

export function AuthorFooter({
  imageSrc,
  alt,
  children,
}: { imageSrc: string; alt: string } & PropsWithChildren) {
  return (
    <div className="flex flex-row items-center">
      <img className="h-48 w-48 rounded-full" src={imageSrc} alt={alt} />
      <p className="ml-4 flex-1">{children}</p>
    </div>
  );
}
