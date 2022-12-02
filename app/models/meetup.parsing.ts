import type { InferType } from "yup";
import { object, string, number, array, date } from "yup";

const MEETUP_EVENT_SCHEMA = object({
  title: string().required(),
  shortUrl: string().required().url(),
  venue: object({
    name: string().required(),
    address: string().defined().strict(true),
    city: string().defined().strict(true),
    state: string().defined().strict(true),
  }).required(),
  dateTime: date().required(),
  going: number().required(),
}).required();

export interface MeetupEvent extends InferType<typeof MEETUP_EVENT_SCHEMA> {}

const MEETUP_GROUP_BY_URL_NAME_SCHEMA = object({
  link: string().required(),
  memberships: object({
    count: number().required(),
  }).required(),
  upcomingEvents: object({
    edges: array()
      .of(
        object({
          node: MEETUP_EVENT_SCHEMA,
        }).required()
      )
      .required(),
  }).required(),
}).required();

export interface MeetupGroupByUrlname
  extends InferType<typeof MEETUP_GROUP_BY_URL_NAME_SCHEMA> {}

const MEETUP_GROUP_RESPONSE_SCHEMA = object({
  data: object({
    groupByUrlname: MEETUP_GROUP_BY_URL_NAME_SCHEMA,
  }).required(),
}).required();

export interface MeetupGroupResponse
  extends InferType<typeof MEETUP_GROUP_RESPONSE_SCHEMA> {}

export interface MeetupRequestBody {
  variables: { urlname: string };
  // TODO use gql utils for better typing
  query: string;
}

export async function parseMeetupGroupResponse(
  val: unknown
): Promise<MeetupGroupResponse> {
  return MEETUP_GROUP_RESPONSE_SCHEMA.validate(val);
}
