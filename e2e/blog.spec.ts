import { test, expect } from "@playwright/test";
import { getCollection } from "@app/lib/content";

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
    const collection = getCollection("blog");
    await expect(
      page.getByRole("heading", { name: collection[0].data.title }),
    ).toBeVisible();
  });

  test("can navigate to most recent post", async ({ page }) => {
    const collection = getCollection("blog");
    await page.goto(`/blog/${collection[0].slug}`);
    await expect(
      page.getByRole("heading", { name: collection[0].data.title }),
    ).toBeVisible();
  });
});
