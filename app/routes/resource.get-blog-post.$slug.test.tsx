// @vitest-environment node
import "@testing-library/jest-dom";
import {
  mockUrlResponse,
  urlToLoaderFunctionArgs,
} from "../../test/test-utils";
import { loader } from "~/routes/resource.get-blog-post.$slug";

const TEST_URL = "https://test.io";
const SLUG = "slug";
const TEST_RAW_MDX_URL = `${TEST_URL}/posts/${SLUG}.mdx`;
const TEST_POST_URL = `${TEST_URL}/${SLUG}`;

const TEST_MDX = `---
title: Title
---
# Header

Hello, world.
`;

describe("/resource/get-blog-post.$slug", () => {
  it("should throw error when there is no slug provided", async () => {
    mockUrlResponse(TEST_RAW_MDX_URL);
    const args = urlToLoaderFunctionArgs(TEST_POST_URL);
    await expect(loader(args)).rejects.toThrowError(
      "Invariant failed: Blog post slug was not provided!"
    );
  });

  it("should throw error when error returned retrieving post", async () => {
    mockUrlResponse(TEST_RAW_MDX_URL);
    const args = urlToLoaderFunctionArgs(TEST_POST_URL, {
      path: { slug: SLUG },
    });
    await expect(loader(args)).rejects.toThrowError(
      "Could not retrieve post. Internal Server Error"
    );
  });

  it("should bundle mdx", async () => {
    mockUrlResponse(TEST_RAW_MDX_URL, { text: TEST_MDX });
    const args = urlToLoaderFunctionArgs(TEST_POST_URL, {
      path: { slug: SLUG },
    });
    const { code, ...metaProps } = await loader(args);
    expect(metaProps).toEqual({ slug: SLUG, frontmatter: { title: "Title" } });
    expect(code).toContain("Hello, world.");
  });
});
