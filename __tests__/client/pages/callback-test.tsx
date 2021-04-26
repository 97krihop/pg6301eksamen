import { act, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Callback } from "../../../src/client/pages/callback";
import { postJson } from "../../../src/client/lib/http";

jest.mock("../../../src/client/lib/http");
//mocks
jest.spyOn(window.sessionStorage.__proto__, "getItem");
window.sessionStorage.__proto__.getItem = jest
  .fn()
  .mockReturnValue(JSON.stringify({ state: "test" }));

beforeEach(() => {
  window.alert = jest.fn();
  // @ts-ignore
  postJson.mockReturnValue({});
});

it("should render alert", () => {
  act(() => {
    render(
      <MemoryRouter>
        <Callback />
      </MemoryRouter>
    );
  });
  screen.getByText("Login callback");
  expect(window.sessionStorage.__proto__.getItem).toHaveBeenCalledTimes(1);
});
