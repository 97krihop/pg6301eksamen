import { act, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { LoginComponent } from "../../../src/client/components/loginComponent";
import { postJson } from "../../../src/client/lib/http";
import userEvent from "@testing-library/user-event";

jest.mock("../../../src/client/lib/http");

beforeEach(() => {
  // @ts-ignore
  postJson.mockReturnValue({});
});

// dont know how to fix the act problem, seems as it is a effect i cant wrap with an act
it("should render inputField", async () => {
  act(() => {
    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>
    );
  });

  const a = screen.getByText("username:");
  const p = screen.getByText("password:");
  await act(async () => {
    await userEvent.type(a, "test");
  });
  await act(async () => {
    await userEvent.type(p, "test");
  });

  const b = await screen.findByText("Log in");

  act(() => {
    userEvent.click(b);
  });
  expect(postJson).toHaveBeenCalledTimes(1);
});
