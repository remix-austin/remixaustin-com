import type { LinksFunction, MetaFunction } from "@remix-run/node";
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

import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

const defaultTitle =
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
