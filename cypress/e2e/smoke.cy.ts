// import { faker } from "@faker-js/faker";

export const homepageLinkTitle = "Remix Austin 💿";
export const meetupUrl = "https://www.meetup.com/remix-austin/";
export const gitHubUrl = "https://github.com/remix-austin";
export const youTubeUrl = "https://www.youtube.com/@remixaustin";

// TODO: Convert cypress tests to TypeScript?

describe("smoke tests", () => {
  it("should load the homepage", () => {
    // Check that the page renders
    cy.visitAndCheck("/");

    // Check top navbar with links exist
    cy.get(
      `nav.navbar > .navbar-start > a.btn:contains("${homepageLinkTitle}")`
    ).should("have.attr", "href", "/");

    cy.get(`nav.navbar > .navbar-end a.btn:contains("Meetup")`).should(
      "have.attr",
      "href",
      meetupUrl
    );

    cy.get(`nav.navbar > .navbar-end a.btn:contains("YouTube")`).should(
      "have.attr",
      "href",
      youTubeUrl
    );

    cy.get(`nav.navbar > .navbar-end a.btn:contains("GitHub")`).should(
      "have.attr",
      "href",
      gitHubUrl
    );

    cy.get(`footer`).should("contain", "Copyright");
  });
});
