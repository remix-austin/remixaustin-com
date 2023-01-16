import DiscordHeaderImage from "~/images/discord-header.jpg";
import HeroImage from "~/images/hero.jpg";
import GivePresentationImage from "~/images/give-a-presentation.jpg";
import { discordUrl } from "~/components/Navbar/SocialLinks";
import type { LinksFunction } from "@remix-run/node";
import { tryToFetchRemixAustinInfo } from "~/models/meetup.server";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import NextEventInfo from "~/components/NextEventInfo/NextEventInfo";
import MeetupLink from "~/components/MeetupLink";
import { meetupUrl } from "~/components/Navbar/SocialLinks";

interface CardProps {
  altText: string;
  imgSrc: string;
  heading: string;
  text: string;
  cta: string;
  ctaLink: string;
  target?: string;
  rel?: string;
}

export const h1Title = "Welcome to Remix Austin! (test)";

function Card({
  altText,
  cta,
  ctaLink,
  heading,
  imgSrc,
  rel,
  text,
  target,
}: CardProps) {
  return (
    <div className="card border border-neutral bg-base-100 shadow-xl">
      <figure className="max-h-48 overflow-clip">
        <img src={imgSrc} alt={altText} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{heading}</h2>
        <p className="mb-4">{text}</p>
        <div className="card-actions justify-end">
          <a
            href={ctaLink}
            className="btn-primary btn"
            target={target}
            rel={rel}
          >
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

export const links: LinksFunction = () => {
  return [{ rel: "preload", href: HeroImage, as: "image" }];
};

export async function loader() {
  const group = await tryToFetchRemixAustinInfo();
  return json({
    link: group?.link,
    nextEvent: group?.upcomingEvents.edges[0]?.node,
  });
}

export default function Index() {
  const { link, nextEvent } = useLoaderData<typeof loader>();
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
      <div className="container mx-auto mb-8 grid grid-cols-1 gap-8 px-8 md:grid-cols-2">
        <Card
          cta="Sign up"
          ctaLink="https://forms.gle/aQxC76yD2pagtB7HA"
          heading="Want to present?"
          text="Giving a talk at the Remix Austin Meetup is a great way to share
                what you've been learning. Not to mention, it helps others learn
                too! Feel free to reach out if you want to know more."
          altText="Remix presentation on Medusa"
          imgSrc={GivePresentationImage}
          target="_blank"
          rel="noopener noreferrer"
        />
        <Card
          altText="Discord header with interesting creatures"
          cta="Chat with us"
          ctaLink={discordUrl}
          heading="Connect on Discord"
          imgSrc={DiscordHeaderImage}
          text="We want to help each other build better experiences on the web for our users by learning and teaching Remix together."
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </>
  );
}
