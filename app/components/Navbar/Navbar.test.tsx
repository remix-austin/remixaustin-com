import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";

import Navbar, { homepageLinkTitle } from "./Navbar";

describe("Navbar", () => {
  it("renders navbar with title and links", () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: homepageLinkTitle })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: "Meetup" })).toHaveLength(2);

    expect(screen.getAllByRole("link", { name: "YouTube" })).toHaveLength(2);

    expect(screen.getAllByRole("link", { name: "GitHub" })).toHaveLength(2);
  });
});
