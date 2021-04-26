import React from "react";
import { render, screen } from "@testing-library/react";
import { NotFound } from "../../../src/client/pages/notFound";
import { MemoryRouter } from "react-router-dom";

it("should render NotFound", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  screen.getByText("NOT FOUND: 404");
  screen.getByText("ERROR: the page you requested in not available.");
  screen.getByText("home");
});
