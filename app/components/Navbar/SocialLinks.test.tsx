import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";

import SocialLinks, {
  meetupUrl,
  gitHubUrl,
  youTubeUrl,
  discordUrl,
} from "./SocialLinks";

describe("SocialLinks", () => {
  it("renders social links", () => {
    render(
      <Router>
        <SocialLinks />
      </Router>
    );

    const meetupLink = screen.getByRole("link", { name: "Meetup" });
    expect(meetupLink).toBeInTheDocument();
    expect(meetupLink).toHaveAttribute("href", meetupUrl);

    const youTubeLink = screen.getByRole("link", { name: "YouTube" });
    expect(youTubeLink).toBeInTheDocument();
    expect(youTubeLink).toHaveAttribute("href", youTubeUrl);

    const gitHubLink = screen.getByRole("link", { name: "GitHub" });
    expect(gitHubLink).toBeInTheDocument();
    expect(gitHubLink).toHaveAttribute("href", gitHubUrl);

    const discordLink = screen.getByRole("link", { name: "Discord" });
    expect(discordLink).toBeInTheDocument();
    expect(discordLink).toHaveAttribute("href", discordUrl);
  });
});
