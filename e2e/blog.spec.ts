import { test, expect } from "@playwright/test";
import { buildFrontMatterCache } from "../blog/writeFrontMatterCache";

test.describe("Blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("has a title", async ({ page }) => {
    const year = new Date().getFullYear().toString();
    const copyrightText = `Copyright © ${year} Remix Austin - All rights reserved.`;

    await expect(page.getByRole("heading", { name: /^Blog$/ })).toBeVisible();
    await expect(page.getByText(copyrightText, { exact: true })).toBeVisible();
  });

  test("has the most recent post", async ({ page }) => {
    const frontMatter = buildFrontMatterCache();
    await expect(
      page.getByRole("heading", { name: frontMatter[0].title })
    ).toBeVisible();
  });

  test("can navigate to most recent post", async ({ page }) => {
    const frontMatter = buildFrontMatterCache();
    await page.goto(`/blog/${frontMatter[0].slug}`);
    await expect(
      page.getByRole("heading", { name: frontMatter[0].title })
    ).toBeVisible();
  });
});
