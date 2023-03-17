import { useMatches } from "@remix-run/react";
import type { ReactNode } from "react";
import { useMemo } from "react";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * If the request's url contains "www.", return the non-www version of the url,
 * and retain all protocol, path & query info.
 *
 * A trailing slash will be added to a hostname if missing the path.
 *
 * Otherwise, return null.
 */
export const getRedirectUrlIfWww = (requestUrl: string): string | null => {
  const url = new URL(requestUrl);
  const hostname = url.hostname;

  if (/^www\./i.test(hostname)) {
    const newHost = url.host.replace(/^www\./i, "");
    return `${url.protocol}//${newHost}${url.pathname}${url.search}`;
  }

  return null;
};

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function isEmptyString(val: unknown): boolean {
  return typeof val === "string" && val.trim().length <= 0;
}

export type PropsWithRequiredChildren<P = unknown> = P & {
  children: ReactNode;
};

const eventTimeFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/Chicago",
});

const NARROW_NON_BREAK_SPACE = String.fromCharCode(8239);

// Note: if we have more date formatting needs we can seperate this function and others
// into a dedicated utils file

/**
 * Formats an date string into a more human readable format
 * For example: "2023-03-08T15:06:39.096Z" -> "Wed, Mar 8, 9:06 AM CST"
 */
export function formatDateTime(dateTime: string) {
  // Discrepency between server and client, see https://github.com/remix-austin/remixaustin-com/issues/83#issuecomment-1450654389
  return eventTimeFormat
    .format(new Date(dateTime))
    .replaceAll(NARROW_NON_BREAK_SPACE, " ");
}
