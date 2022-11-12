export default function Index() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mb-8">
        <img src="/img/remix-logo-rainbow.jpg" alt="Remix Austin logo" />
      </div>
      <h1 className="text-5xl font-bold">Welcome to Remix Austin!</h1>
      <p className="py-2">
        We are the premiere Remix community for developers in Austin, and we
        stream remotely all over the world!
      </p>
      <a
        href="https://www.meetup.com/remix-austin/"
        className="btn-primary btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join us via Meetup.com!
      </a>
    </div>
  );
}
