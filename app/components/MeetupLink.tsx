import MeetupIcon from "~/components/icons/MeetupIcon";
import type { PropsWithRequiredChildren } from "~/utils";

export default function MeetupLink({
  link,
  children,
}: PropsWithRequiredChildren<{ link: string }>) {
  return (
    <a
      href={link}
      className="btn btn-primary mb-8"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="mr-2">{children}</span>
      <MeetupIcon />
    </a>
  );
}
