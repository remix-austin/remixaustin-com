// @vitest-environment node
import "@testing-library/jest-dom";
import { mockUrlResponse, urlToLoaderArgs } from "../../test/test-utils";
import {
  loader,
  LONG_CACHE_MAX_AGE,
  SHORT_CACHE_MAX_AGE,
} from "~/routes/blog.$slug";
import { bundleMdx } from "../../blog/parser.server";
import { POSTS_BUILD_DIR } from "blog/paths";

const TEST_URL = "https://test.io";
const SLUG = "slug";
const TEST_GET_BLOG_POST_URL = `${TEST_URL}/resource/get-blog-post/${SLUG}`;
const TEST_POST_URL = `${TEST_URL}/${SLUG}`;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

describe("/blog/$slug", () => {
  it("should bundle mdx", async () => {
    const todayPublishDate = new Date().toISOString();
    const testMdx = `---
title: Title
date: ${todayPublishDate}
---
# Header

Hello, world.
`;
    mockUrlResponse(TEST_GET_BLOG_POST_URL, {
      json: await bundleMdx(testMdx, SLUG, POSTS_BUILD_DIR),
    });
    const args = urlToLoaderArgs(TEST_POST_URL, { path: { slug: SLUG } });
    const response = await loader(args);
    const {
      post: { code, ...metaProps },
    } = await response.json();
    expect(metaProps).toEqual({
      slug: SLUG,
      frontmatter: { title: "Title", date: todayPublishDate },
    });
    expect(code).toContain("Hello, world.");
  });

  describe("Cache-Control headers", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should have a Cache-Control header with a max-age of 8 hours if post is less than 4 days old", async () => {
      const now = new Date();
      vi.setSystemTime(now);
      const fourDaysAgoMs = now.getTime() - ONE_DAY_MS * 4 + 1; // Just under 4 days old
      const publishDate = new Date(fourDaysAgoMs).toISOString();
      const testMdx = `---
title: Title
date: ${publishDate}
---
# Header

Hello, world.
`;
      mockUrlResponse(TEST_GET_BLOG_POST_URL, {
        json: await bundleMdx(testMdx, SLUG, POSTS_BUILD_DIR),
      });
      const args = urlToLoaderArgs(TEST_POST_URL, { path: { slug: SLUG } });
      const response = await loader(args);
      const cacheControlHeader = response.headers.get("Cache-Control");
      expect(cacheControlHeader).not.toBeNull();
      expect(cacheControlHeader).toBe(SHORT_CACHE_MAX_AGE);
    });

    it("should have a Cache-Control header with a max-age of 1 week if post is 4 days old or older", async () => {
      const now = new Date();
      vi.setSystemTime(now);
      const fourDaysAgoMs = now.getTime() - ONE_DAY_MS * 4;
      const publishDate = new Date(fourDaysAgoMs).toISOString();
      const testMdx = `---
title: Title
date: ${publishDate}
---
# Header

Hello, world.
`;
      mockUrlResponse(TEST_GET_BLOG_POST_URL, {
        json: await bundleMdx(testMdx, SLUG, POSTS_BUILD_DIR),
      });
      const args = urlToLoaderArgs(TEST_POST_URL, { path: { slug: SLUG } });
      const response = await loader(args);
      const cacheControlHeader = response.headers.get("Cache-Control");
      expect(cacheControlHeader).not.toBeNull();
      expect(cacheControlHeader).toBe(LONG_CACHE_MAX_AGE);
    });
  });
});
