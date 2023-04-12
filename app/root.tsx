import { redirect } from "@remix-run/node";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "@remix-run/react";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getRedirectUrlIfWww } from "./utils";
import { LiveReload } from "./components/LiveReload";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const defaultTitle =
  "Remix Austin 💿 A community & monthly Meetup event for Remix developers";
const defaultDescription =
  "We are the premiere Remix community for developers in Austin, TX, and we stream remotely all over the world!";
const baseUrl = "https://remixaustin.com/";
const logoUrl = "https://remixaustin.com/img/remix-logo-rainbow.jpg";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: defaultTitle,
  description: defaultDescription,
  viewport: "width=device-width,initial-scale=1",
  "twitter:card": "summary_large_image",
  "twitter:title": defaultTitle,
  "twitter:description": defaultDescription,
  "twitter:image": logoUrl,
  "twitter:image:alt": "Remix Austin logo",
  "og:type": "website",
  "og:title": defaultTitle,
  "og:site_name": "Remix Austin 💿",
  "og:description": defaultDescription,
  "og:url": baseUrl,
  "og:image": logoUrl,
});

export const loader: LoaderFunction = async ({ request }) => {
  // Redirect if "www." is in the url.
  const redirectUrl = getRedirectUrlIfWww(request.url);
  if (redirectUrl) {
    return redirect(redirectUrl, 308);
  }

  return null;
};

export default function App() {
  const matches = useMatches();

  const includeScripts = matches.some((match) => match.handle?.hydrate);

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
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}
