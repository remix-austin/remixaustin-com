import GitHubIcon from "../icons/GitHubIcon";
import MeetupIcon from "../icons/MeetupIcon";
import YouTubeIcon from "../icons/YouTubeIcon";
import DiscordIcon from "../icons/DiscordIcon";

export const meetupUrl = "https://www.meetup.com/remix-austin/";
export const gitHubUrl = "https://github.com/remix-austin";
export const youTubeUrl = "https://www.youtube.com/@remixaustin";
export const discordUrl = "https://discord.gg/mYy2kzqX";

export default function SocialLinks({
  linkClassName,
}: {
  linkClassName?: string;
}) {
  return (
    <>
      <li>
        <a
          className={linkClassName}
          href={meetupUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Meetup
          <MeetupIcon />
        </a>
      </li>
      <li>
        <a
          className={linkClassName}
          href={youTubeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube
          <YouTubeIcon />
        </a>
      </li>
      <li>
        <a
          className={linkClassName}
          href={gitHubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <GitHubIcon />
        </a>
      </li>
      <li>
        <a
          className={linkClassName}
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
          <DiscordIcon />
        </a>
      </li>
    </>
  );
}
