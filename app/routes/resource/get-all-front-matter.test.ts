// @vitest-environment node
import { loader } from "~/routes/resource/get-all-front-matter";
import { mockUrlResponse, urlToLoaderArgs } from "../../../test/test-utils";
import type {
  PostFrontMatterCollection,
  PostFrontMatterWithSlug,
} from "../../../blog/models";

const TEST_URL = "https://test.io";
const TEST_FRONT_MATTER_URL = `${TEST_URL}/front-matter-cache.json`;

const FIRST_TEST_FRONT_MATTER: PostFrontMatterWithSlug = {
  slug: "slug",
  title: "title",
  date: "2020-02-02T02:02:02Z",
  author: "author",
  description: "description",
  imageAlt: "imageAlt",
  imageUrl: `${TEST_URL}/first.png`,
};

const SECOND_TEST_FRONT_MATTER: PostFrontMatterWithSlug = {
  slug: "SLUG",
  title: "TITLE",
  date: "2020-03-03T03:03:03Z",
  author: "AUTHOR",
  description: "DESCRIPTION",
  imageAlt: "IMAGE_ALT",
  imageUrl: `${TEST_URL}/second.png`,
};

describe("/resource/get-all-front-matter", () => {
  it("should throw error when there is an error retrieving front matter cache", async () => {
    mockUrlResponse({ url: TEST_FRONT_MATTER_URL });
    const args = urlToLoaderArgs(TEST_URL);
    await expect(loader(args)).rejects.toThrowError(
      "Could not retrieve posts. Internal Server Error"
    );
  });
  describe("when there are two posts", () => {
    let frontMatter: PostFrontMatterCollection;

    beforeEach(() => {
      frontMatter = [FIRST_TEST_FRONT_MATTER, SECOND_TEST_FRONT_MATTER];
      mockUrlResponse({ url: TEST_FRONT_MATTER_URL, body: frontMatter });
    });

    it("should return first page of front matter when no page params provided", async () => {
      const args = urlToLoaderArgs(TEST_URL);
      await expect(loader(args)).resolves.toEqual(frontMatter);
    });

    it("should return first page of front matter", async () => {
      const args = urlToLoaderArgs(TEST_URL, { page: "1", pageSize: "1" });
      await expect(loader(args)).resolves.toEqual([FIRST_TEST_FRONT_MATTER]);
    });

    it("should return second page of front matter", async () => {
      const args = urlToLoaderArgs(TEST_URL, { page: "2", pageSize: "1" });
      await expect(loader(args)).resolves.toEqual([SECOND_TEST_FRONT_MATTER]);
    });
  });
});
