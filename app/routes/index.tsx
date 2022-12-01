import MeetupIcon from "~/components/icons/MeetupIcon";
import DiscordHeader from "~/images/discord-header.jpg";

interface CardProps {
  altText: string;
  imgSrc: string;
  heading: string;
  text: string;
  cta: string;
  ctaLink: string;
}

function Card({ altText, cta, ctaLink, heading, imgSrc, text }: CardProps) {
  return (
    <div className="card border border-neutral bg-base-100 shadow-xl">
      <figure className="max-h-48 overflow-clip">
        <img src={imgSrc} alt={altText} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{heading}</h2>
        <p className="mb-4">{text}</p>
        <div className="card-actions justify-end">
          <a href={ctaLink} className="btn-primary btn">
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <>
      <div
        className="hero mb-8"
        style={{
          backgroundImage: `url("https://secure.meetupstatic.com/photos/event/7/4/6/6/highres_505889798.jpeg")`,
        }}
      >
        <div className="hero-overlay bg-opacity-90"></div>
        <div className="hero-content py-32 text-center text-white">
          <div className="max-w-md">
            <div className="mb-4">
              <img
                src="/img/remix-logo-rainbow.svg"
                alt="Remix Austin logo"
                className="my-0"
              />
            </div>
            <h1 className="mb-4 inline-block text-5xl font-bold">
              Welcome to Remix Austin!
            </h1>
            <p className="mb-4">
              We are the premiere Remix community for developers in Austin, and
              we stream remotely all over the world!
            </p>
            <a
              href="https://www.meetup.com/remix-austin/"
              className="btn-primary btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mr-2">Join us on Meetup</span>
              <MeetupIcon />
            </a>
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
          imgSrc="https://secure.meetupstatic.com/photos/event/7/4/6/5/highres_505889797.webp"
        />
        <Card
          altText="Discord header with interesting creatures"
          cta="Chat with us"
          ctaLink="https://discord.com/channels/770287896669978684/953371044108972112"
          heading="Connect on Discord"
          imgSrc={DiscordHeader}
          text="We want to help each other build better experiences on the web for our users by learning and teaching Remix together."
        />
      </div>
    </>
  );
}
