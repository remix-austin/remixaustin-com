// @vitest-environment node
import "@testing-library/jest-dom";
import { mockUrlResponse, urlToLoaderArgs } from "../../test/test-utils";
import { loader } from "~/routes/blog.$slug";
import { bundleMdx } from "../../blog/parser.server";
import { POSTS_BUILD_DIR } from "blog/paths";

const TEST_URL = "https://test.io";
const SLUG = "slug";
const TEST_GET_BLOG_POST_URL = `${TEST_URL}/resource/get-blog-post/${SLUG}`;
const TEST_POST_URL = `${TEST_URL}/${SLUG}`;
const TEST_MDX = `---
title: Title
---
# Header

Hello, world.
`;

describe("/blog/$slug", () => {
  it("should bundle mdx", async () => {
    mockUrlResponse(TEST_GET_BLOG_POST_URL, {
      json: await bundleMdx(TEST_MDX, SLUG, POSTS_BUILD_DIR),
    });
    const args = urlToLoaderArgs(TEST_POST_URL, { path: { slug: SLUG } });
    const {
      post: { code, ...metaProps },
    } = await loader(args);
    expect(metaProps).toEqual({ slug: SLUG, frontmatter: { title: "Title" } });
    expect(code).toContain("Hello, world.");
  });
});
