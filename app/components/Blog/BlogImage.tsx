export function BlogImage({
  caption,
  maxWidth,
  alt,
  ...props
}: {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
}) {
  return (
    <figure className="flex flex-col items-center">
      <img
        className="object-contain"
        style={{ maxWidth: maxWidth || "100%" }}
        alt={alt}
        {...props}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
