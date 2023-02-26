import MeetupIcon from "~/components/icons/MeetupIcon";
import type { PropsWithRequiredChildren } from "~/utils/utils";

export default function MeetupLink({
  link,
  children,
}: PropsWithRequiredChildren<{ link: string }>) {
  return (
    <a
      href={link}
      className="btn-primary btn mb-8"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="mr-2">{children}</span>
      <MeetupIcon />
    </a>
  );
}
