import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import * as Sentry from "@sentry/remix";
import HeroImage from "~/images/hero.jpg";
import { tryToFetchRemixAustinInfo } from "~/models/meetup.server";
import NextEventInfo from "~/components/NextEventInfo/NextEventInfo";
import MeetupLink from "~/components/MeetupLink";
import { meetupUrl } from "~/components/Navbar/SocialLinks";
import getEnv from "~/utils/errors.server";

export const h1Title = "Welcome to Remix Austin!";

export async function loader() {
  const group = await tryToFetchRemixAustinInfo();
  return json({
    link: group?.link,
    nextEvent: group?.upcomingEvents.edges[0]?.node,
    env: getEnv(),
  });
}
export const meta: MetaFunction = () => {
  return {
    robots: "noindex",
  };
};

export default function Index() {
  const { link, nextEvent, env } = useLoaderData<typeof loader>();

  function throwException() {
    Sentry.captureException(`Button clicked in "${env.SENTRY_ENVIRONMENT}"`);
  }

  // TODO: Remove this test event
  Sentry.captureEvent({
    level: "info",
    message: `Page loaded event`,
  });

  return (
    <>
      <div
        className="hero mb-8"
        style={{
          backgroundImage: `url(${HeroImage})`,
        }}
      >
        <div className="hero-overlay bg-opacity-90"></div>
        <div className="hero-content py-10 text-center text-white md:py-32 ">
          <div className="max-w-md">
            <div className="mb-4">
              <img
                src="/img/remix-logo-rainbow.svg"
                alt="Remix Austin logo"
                className="my-0"
              />
            </div>
            <h1 className="mb-4 inline-block text-5xl font-bold">{h1Title}</h1>
            <p className="mb-8">
              We are the premiere Remix community for developers in Austin, and
              we stream remotely all over the world!
            </p>
            <p>
              <button
                className="btn-secondary btn my-4"
                onClick={throwException}
              >
                Throw an error
              </button>
            </p>
            {nextEvent ? (
              <NextEventInfo event={nextEvent} />
            ) : (
              <MeetupLink link={link || meetupUrl}>
                Join us on Meetup!
              </MeetupLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
