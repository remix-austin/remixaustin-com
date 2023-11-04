import * as v from "valibot";
import type { Output } from "valibot";

const meetupEventSchema = v.object({
  title: v.string(),
  shortUrl: v.string([v.url()]),
  venue: v.optional(
    v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
    }),
  ),
  dateTime: v.string(),
  going: v.number(),
});

export type MeetupEvent = Output<typeof meetupEventSchema>;

const meetupGroupByUrlnameSchema = v.object({
  link: v.string([v.url()]),
  upcomingEvents: v.object({
    edges: v.array(
      v.object({
        node: meetupEventSchema,
      }),
    ),
  }),
});

export type MeetupGroupByUrlname = Output<typeof meetupGroupByUrlnameSchema>;

const meetupGroupResponseSchema = v.object({
  data: v.object({
    groupByUrlname: meetupGroupByUrlnameSchema,
  }),
});

export type MeetupGroupResponse = Output<typeof meetupGroupResponseSchema>;

export interface MeetupRequestBody {
  variables: { urlname: string };
  // TODO use gql utils for better typing
  query: string;
}

export async function parseMeetupGroupResponse(val: unknown) {
  return v.parse(meetupGroupResponseSchema, val);
}
