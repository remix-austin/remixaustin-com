import type { MeetupRequestBody } from "~/models/meetup.parsing";
import { parseMeetupGroupResponse } from "~/models/meetup.parsing";

const REMIX_AUSTIN_MEETUP_URL = "remix-austin";
const MEETUP_API = "https://www.meetup.com/gql";
const JSON_HEADERS: HeadersInit = { Accept: "application/json" };

// TODO use gql utils for typing
const GET_GROUP_QUERY = `
  query($urlname: String!) {
   groupByUrlname(urlname: $urlname) {
    link
    upcomingEvents(input: {first: 1}){
     edges {
      node {
       title
       shortUrl
       venue {
        name
        address
        city
        state
       }
       dateTime
       going
      }
     }
    }
   }
  }
`;

async function getMeetupGroupInfo(url: string) {
  const body: MeetupRequestBody = {
    variables: { urlname: url },
    query: GET_GROUP_QUERY,
  };
  return fetch(MEETUP_API, {
    method: "POST",
    body: JSON.stringify(body),
    headers: JSON_HEADERS,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(`Error fetching from Meetup API: ${res.statusText}`);
    })
    .then(parseMeetupGroupResponse);
}

/**
 * @returns undefined if there is an error fetching info
 */
export async function tryToFetchRemixAustinInfo() {
  return getMeetupGroupInfo(REMIX_AUSTIN_MEETUP_URL)
    .then((res) => res.data.groupByUrlname)
    .catch((e) => {
      console.warn(`Error retrieving Meetup info (%s). Ignoring.`, e.message);
      return undefined;
    });
}
