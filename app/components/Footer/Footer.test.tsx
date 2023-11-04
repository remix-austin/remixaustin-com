import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Footer, { copyrightText } from "./Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);

    expect(screen.getByText(copyrightText)).toBeInTheDocument();
  });
});
