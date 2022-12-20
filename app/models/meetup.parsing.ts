import { z } from "zod";

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
  dateTime: z.string(),
  going: z.number(),
});

export type MeetupEvent = z.infer<typeof meetupEventSchema>;

const meetupGroupByUrlnameSchema = z.object({
  link: z.string(),
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
