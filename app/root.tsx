import { redirect } from "@remix-run/node";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import tailwindStyles from "./tailwind.css?url";
import { getRedirectUrlIfWww } from "./utils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStyles }];
};

export const defaultTitle =
  "Remix Austin 💿 A community & monthly Meetup event for Remix developers";
const defaultDescription =
  "We are the premiere Remix community for developers in Austin, TX, and we stream remotely all over the world!";
const baseUrl = "https://remixaustin.com/";
const logoUrl = "https://remixaustin.com/img/remix-logo-rainbow.jpg";

export const meta: MetaFunction = () => [
  {
    name: "charset",
    content: "utf-8",
  },
  { title: defaultTitle },
  {
    name: "description",
    content: defaultDescription,
  },
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1",
  },
  {
    name: "twitter:card",
    content: "summary_large_image",
  },
  {
    name: "twitter:title",
    content: defaultTitle,
  },
  {
    name: "twitter:description",
    content: defaultDescription,
  },
  {
    name: "twitter:image",
    content: logoUrl,
  },
  {
    name: "twitter:image:alt",
    content: "Remix Austin logo",
  },
  {
    name: "og:type",
    content: "website",
  },
  {
    name: "og:title",
    content: defaultTitle,
  },
  {
    name: "og:site_name",
    content: "Remix Austin 💿",
  },
  {
    name: "og:description",
    content: defaultDescription,
  },
  {
    name: "og:url",
    content: baseUrl,
  },
  {
    name: "og:image",
    content: logoUrl,
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  // Redirect if "www." is in the url.
  const redirectUrl = getRedirectUrlIfWww(request.url);
  if (redirectUrl) {
    return redirect(redirectUrl, 308);
  }

  return null;
};

export default function App() {
  return (
    <html lang="en" className="relative h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="dark relative h-full">
        <Navbar />
        <main className="container mx-auto max-w-none">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
