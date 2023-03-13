import type { MeetupEvent } from "~/models/meetup.parsing";
import { formatDateTime, isEmptyString } from "~/utils";
import MeetupLink from "~/components/MeetupLink";
import type { SerializeFrom } from "@remix-run/server-runtime";

type Venue = NonNullable<MeetupEvent["venue"]>;

const DEFAULT_VENUE: Venue = {
  name: "H-E-B Digital & Favor Eastside Tech Hub (and online)",
  address: "2416 E 6th St",
  city: "Austin",
  state: "TX",
};

function isValidVenue(venue: MeetupEvent["venue"]): venue is Venue {
  return (
    venue !== null &&
    !isEmptyString(venue.address) &&
    !isEmptyString(venue.city) &&
    !isEmptyString(venue.state)
  );
}

export type SerializedMeetupEvent = SerializeFrom<MeetupEvent>;

export default function NextEventInfo({
  event,
}: {
  event: SerializedMeetupEvent;
}) {
  const venue = isValidVenue(event.venue) ? event.venue : DEFAULT_VENUE;

  const buttonPronoun = event.going <= 1 ? "us" : `${event.going} others`;
  return (
    <>
      <MeetupLink link={event.shortUrl}>
        Join {buttonPronoun} at our next meetup!
      </MeetupLink>
      <p className="text-xl font-bold">{event.title}</p>
      <p>
        <time dateTime={event.dateTime}>{formatDateTime(event.dateTime)}</time>
      </p>
      <p>{venue.name}</p>
      <p>
        {venue.address}, {venue.city}, {venue.state}
      </p>
    </>
  );
}
