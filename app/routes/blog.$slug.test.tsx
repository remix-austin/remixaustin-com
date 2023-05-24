// @vitest-environment node
import "@testing-library/jest-dom";
import { mockUrlResponse, urlToLoaderArgs } from "../../test/test-utils";
import { loader, longCacheMaxAge, shortCacheMaxAge } from "~/routes/blog.$slug";
import { bundleMdx } from "../../blog/parser";
import { POSTS_BUILD_DIR } from "blog/paths";

const TEST_URL = "https://test.io";
const SLUG = "slug";
const TEST_GET_BLOG_POST_URL = `${TEST_URL}/resource/get-blog-post/${SLUG}`;
const TEST_POST_URL = `${TEST_URL}/${SLUG}`;
const ONE_MINUTE_MS = 1000 * 60;
const ONE_DAY_MS = ONE_MINUTE_MS * 60 * 24;

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

  it("should have a Cache-Control header with a max-age of 8 hours if post is less than 4 days old", async () => {
    const today = Date.now();
    const fourDaysAgoMs = today - ONE_DAY_MS * 4 + ONE_MINUTE_MS; // 1 minute "safety buffer"
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
    expect(cacheControlHeader).toBe(shortCacheMaxAge);
  });

  it("should have a Cache-Control header with a max-age of 1 week if post is more than 4 days old", async () => {
    const today = Date.now();
    const fourDaysAgoMs = today - ONE_DAY_MS * 4 - ONE_MINUTE_MS; // 1 minute "safety buffer"
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
    expect(cacheControlHeader).toBe(longCacheMaxAge);
  });
});
