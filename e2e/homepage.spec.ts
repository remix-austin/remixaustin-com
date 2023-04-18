import { test, expect } from "@playwright/test";
import { buildFrontMatterCache } from "../blog/writeFrontMatterCache";
// import { defaultTitle } from "../app/root";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage has title and footer text", async ({ page }) => {
    const pageTitle =
      "Remix Austin 💿 A community & monthly Meetup event for Remix developers";
    const h1Title = "Welcome to Remix Austin!";
    const year = new Date().getFullYear().toString();
    const copyrightText = `Copyright © ${year} Remix Austin - All rights reserved.`;

    await expect(page).toHaveTitle(pageTitle);
    await expect(page.getByRole("heading", { name: h1Title })).toBeVisible();
    await expect(page.getByText(copyrightText, { exact: true })).toBeVisible();
  });
});

test.describe("Blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("has a title", async ({ page }) => {
    const h1Title = "Blog";
    const year = new Date().getFullYear().toString();
    const copyrightText = `Copyright © ${year} Remix Austin - All rights reserved.`;

    await expect(page.getByRole("heading", { name: h1Title })).toBeVisible();
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
