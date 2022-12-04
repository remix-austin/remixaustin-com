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

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getRedirectUrlIfWww } from "./utils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Austin 💿",
  viewport: "width=device-width,initial-scale=1",
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
