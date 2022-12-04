import { test, expect } from "@playwright/test";
// import { h1Title } from "~/routes/index";
// import { defaultTitle } from "../app/root";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage has title and footer text", async ({ page }) => {
    // TODO: Import from ".tsx" files is failing ... perhaps we need to add some tsconfig to e2e tests?
    //       (see https://playwright.dev/docs/test-typescript)

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
