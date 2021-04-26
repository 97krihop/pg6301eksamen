import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Logout } from "../../../src/client/pages/logout";
import { postJson } from "../../../src/client/lib/http";

jest.mock("../../../src/client/lib/http");

beforeEach(() => {
  // @ts-ignore
  postJson.mockReturnValue({});
});

it("should render logout", () => {
  render(
    <MemoryRouter>
      <Logout />
    </MemoryRouter>
  );
  screen.getByText("logout");
  expect(postJson).toHaveBeenCalledTimes(1);
});
