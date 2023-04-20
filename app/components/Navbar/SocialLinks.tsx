import GitHubIcon from "../icons/GitHubIcon";
import MeetupIcon from "../icons/MeetupIcon";
import YouTubeIcon from "../icons/YouTubeIcon";
import DiscordIcon from "../icons/DiscordIcon";
// import { NavLink } from "@remix-run/react";
// import BlogIcon from "../icons/BlogIcon";

export const meetupUrl = "https://www.meetup.com/remix-austin/";
export const gitHubUrl = "https://github.com/remix-austin";
export const youTubeUrl = "https://www.youtube.com/@remixaustin";
export const discordUrl = "https://discord.gg/rZpbp3mQqd";

export default function SocialLinks({
  linkClassName,
}: {
  linkClassName?: string;
}) {
  return (
    <>
      {/* Code seems to be ready. Just waiting until we have a post approved. */}
      {/* <li>
        <NavLink className={linkClassName} to="blog">
          <BlogIcon />
          Blog
        </NavLink>
      </li> */}
      <li>
        <a
          className={linkClassName}
          href={meetupUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MeetupIcon />
          Meetup
        </a>
      </li>
      <li>
        <a
          className={linkClassName}
          href={youTubeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTubeIcon />
          YouTube
        </a>
      </li>
      <li>
        <a
          className={linkClassName}
          href={gitHubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
          GitHub
        </a>
      </li>
      <li>
        <a
          className={linkClassName}
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DiscordIcon />
          Discord
        </a>
      </li>
    </>
  );
}
