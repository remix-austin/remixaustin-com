export function BlogImage(props: { src: string; alt: string }) {
  return <img style={{ objectFit: "contain" }} {...props} />;
}
