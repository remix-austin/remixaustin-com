import type { MeetupEvent } from "~/models/meetup.parsing";
import { isEmptyString } from "~/utils";
import MeetupLink from "~/components/MeetupLink";
import type { SerializeFrom } from "@remix-run/server-runtime";

const DEFAULT_VENUE: MeetupEvent["venue"] = {
  name: "H-E-B Digital & Favor Eastside Tech Hub (and online)",
  address: "2416 E 6th St",
  city: "Austin",
  state: "TX",
};

const EVENT_TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/Chicago",
});

function isUndefinedVenue(venue: MeetupEvent["venue"]): boolean {
  return (
    isEmptyString(venue.address) ||
    isEmptyString(venue.city) ||
    isEmptyString(venue.state)
  );
}

export type SerializedMeetupEvent = SerializeFrom<MeetupEvent>;

export default function NextEventInfo({
  event,
}: {
  event: SerializedMeetupEvent;
}) {
  const venue = isUndefinedVenue(event.venue) ? DEFAULT_VENUE : event.venue;
  const buttonPronoun = event.going <= 1 ? "us" : `${event.going} others`;
  return (
    <>
      <MeetupLink link={event.shortUrl}>
        Join {buttonPronoun} at our next meetup!
      </MeetupLink>
      <p className="text-xl font-bold">{event.title}</p>
      <p>
        <time dateTime={event.dateTime}>
          {EVENT_TIME_FORMAT.format(new Date(event.dateTime))}
        </time>
      </p>
      <p>{venue.name}</p>
      <p>
        {venue.address}, {venue.city}, {venue.state}
      </p>
    </>
  );
}
