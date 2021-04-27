import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Profile } from "../../../src/client/pages/profile";
import { useLoading } from "../../../src/client/lib/useLoading";
import { ErrorView } from "../../../src/client/components/errorView";

jest.mock("../../../src/client/lib/useLoading");
jest.mock("../../../src/client/components/errorView");

it("should render profile with picture", () => {
  // @ts-ignore
  useLoading.mockReturnValue({
    error: null,
    loading: false,
    data: {
      firstname: "test1",
      lastname: "test2",
      picture: "https://i.imgur.com/uqOYnwl.jpeg",
    },
  });
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
  screen.getByText("test1 test2");
  screen.getAllByAltText("profile picture");
});
it("should render profile", () => {
  // @ts-ignore
  useLoading.mockReturnValue({
    error: null,
    loading: false,
    data: {
      firstname: "test1",
      lastname: "test2",
    },
  });
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
  screen.getByText("test1 test2");
});
it("should render Loading", () => {
  // @ts-ignore
  useLoading.mockReturnValue({
    error: null,
    loading: true,
    data: {
      firstname: "test1",
      lastname: "test2",
    },
  });
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
  screen.getByText("Loading...");
});
it("should render error", () => {
  // @ts-ignore
  useLoading.mockReturnValue({
    error: "error",
    loading: false,
    data: {
      firstname: "test1",
      lastname: "test2",
    },
  });
  // @ts-ignore
  ErrorView.mockReturnValue(<div>error</div>);
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
  screen.getByText("error");
});
