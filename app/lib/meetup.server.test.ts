import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { tryToFetchRemixAustinInfo } from "./meetup.server";
import { server } from "../../mocks/server";
import { rest } from "msw";
import type {
  MeetupEvent,
  MeetupGroupByUrlname,
  MeetupGroupResponse,
  MeetupRequestBody,
} from "./meetup.models";
import invariant from "tiny-invariant";

const MOCK_EVENT: MeetupEvent = {
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

const MOCK_GROUP: MeetupGroupByUrlname = {
  link: "https://group.link",
  upcomingEvents: {
    edges: [{ node: MOCK_EVENT }],
  },
};

const MEETUP_URL = "https://www.meetup.com/gql";

describe("meetup.server", () => {
  describe("tryToFetchRemixAustinInfo", () => {
    let lastRequestBody: MeetupRequestBody | undefined;

    beforeEach(() => {
      const noOp = () => {};
      vi.spyOn(console, "warn").mockImplementation(noOp);
      server.use(
        rest.post(MEETUP_URL, async (req, res, context) => {
          lastRequestBody = await req.json();
          const response: MeetupGroupResponse = {
            data: { groupByUrlname: MOCK_GROUP },
          };
          return res(context.status(200), context.json(response));
        }),
      );
    });

    afterEach(() => {
      lastRequestBody = undefined;
    });

    it("should call meetup api", async () => {
      const event = await tryToFetchRemixAustinInfo();
      invariant(lastRequestBody, "lastRequestBody must be defined");
      expect(lastRequestBody.variables).toEqual({ urlname: "remix-austin" });
      // TODO use gql utils for better assertions
      expect(lastRequestBody.query.includes("groupByUrlname")).toBeTruthy();
      expect(event).toEqual(MOCK_GROUP);
    });

    describe("with a malformed response", () => {
      beforeEach(() => {
        server.use(
          rest.post(MEETUP_URL, (req, res, context) =>
            res(context.status(200), context.json({ data: {} })),
          ),
        );
      });

      it("should return undefined", async () => {
        const info = await tryToFetchRemixAustinInfo();
        invariant(info === undefined, "Returned info should be undefined");
      });
    });

    describe("with a 500 response", () => {
      beforeEach(() => {
        server.use(
          rest.post(MEETUP_URL, (req, res, context) => {
            const response: MeetupGroupResponse = {
              data: { groupByUrlname: MOCK_GROUP },
            };
            return res(context.status(500), context.json(response));
          }),
        );
      });

      it("should return undefined", async () => {
        const info = await tryToFetchRemixAustinInfo();
        invariant(info === undefined, "Returned info should be undefined");
      });
    });
  });
});
