import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage has title and footer text", async ({ page }) => {
    // NOTE: It appears that playwright doesn't support tsx, despite some debate about it.
    //       (see https://github.com/microsoft/playwright/issues/7121)
    //       The strings below are duplicates because we can't import.

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
