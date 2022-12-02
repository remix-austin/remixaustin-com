import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import type { SerializedMeetupEvent } from "./NextEventInfo";
import NextEventInfo from "./NextEventInfo";

const DEFAULT_ONLINE_EVENT: SerializedMeetupEvent = {
  title: "Title",
  shortUrl: "https://short.url",
  venue: {
    name: "Online",
    address: "",
    city: "",
    state: "",
  },
  dateTime: "2022-01-01T01:00:00Z",
  going: 100,
};

describe("NextEventInfo", () => {
  it("renders given venue", () => {
    const eventWithVenue = {
      ...DEFAULT_ONLINE_EVENT,
      venue: {
        name: "Venue name",
        address: "Venue address",
        city: "Venue city",
        state: "Venue state",
      },
    };
    render(<NextEventInfo event={eventWithVenue} />);
    expect(screen.getByText("Venue name")).toBeInTheDocument();
    expect(
      screen.getByText("Venue address, Venue city, Venue state")
    ).toBeInTheDocument();
  });

  it("renders default venue for online events", () => {
    render(<NextEventInfo event={DEFAULT_ONLINE_EVENT} />);
    expect(
      screen.getByText("H-E-B Digital & Favor Eastside Tech Hub (and online)")
    ).toBeInTheDocument();
    expect(screen.getByText("2416 E 6th St, Austin, TX")).toBeInTheDocument();
  });

  it("renders date in the correct time zone", () => {
    render(<NextEventInfo event={DEFAULT_ONLINE_EVENT} />);
    expect(screen.getByText("Fri, Dec 31, 7:00 PM CST")).toBeInTheDocument();
  });

  it("renders button label when many are attending", () => {
    const eventWithManyAttending = { ...DEFAULT_ONLINE_EVENT, going: 10 };
    render(<NextEventInfo event={eventWithManyAttending} />);
    expect(
      screen.getByRole("link", { name: "Join 10 others at our next meetup!" })
    ).toBeInTheDocument();
  });

  it("renders button label when no one is attending", () => {
    const eventWithNoOneAttending = { ...DEFAULT_ONLINE_EVENT, going: 0 };
    render(<NextEventInfo event={eventWithNoOneAttending} />);
    expect(
      screen.getByRole("link", { name: "Join us at our next meetup!" })
    ).toBeInTheDocument();
  });
});
