import { z } from "zod";

const formatEventDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/Chicago",
});

const meetupEventSchema = z.object({
  title: z.string(),
  shortUrl: z.string().url(),
  venue: z
    .object({
      name: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
    })
    .nullable(),
  dateTime: z.string().transform((dateTime) => ({
    localDateTime: dateTime,
    // Formatting on the server ensures there won't be a server-client hydration mismatch
    formatted: formatEventDate.format(new Date(dateTime)),
  })),
  going: z.number(),
});

export type MeetupEvent = z.infer<typeof meetupEventSchema>;

const meetupGroupByUrlnameSchema = z.object({
  link: z.string().url(),
  upcomingEvents: z.object({
    edges: z.array(
      z.object({
        node: meetupEventSchema,
      })
    ),
  }),
});

export type MeetupGroupByUrlname = z.infer<typeof meetupGroupByUrlnameSchema>;

const meetupGroupResponseSchema = z.object({
  data: z.object({
    groupByUrlname: meetupGroupByUrlnameSchema,
  }),
});

export type MeetupGroupResponse = z.infer<typeof meetupGroupResponseSchema>;

export interface MeetupRequestBody {
  variables: { urlname: string };
  // TODO use gql utils for better typing
  query: string;
}

export async function parseMeetupGroupResponse(val: unknown) {
  return meetupGroupResponseSchema.parse(val);
}
