import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React, { ChangeEvent } from "react";
import { useSubmit } from "../../../src/client/lib/useSubmit";
import { NewUser } from "../../../src/client/pages/newUser";
import { useLoading } from "../../../src/client/lib/useLoading";
import userEvent from "@testing-library/user-event";

jest.mock("../../../src/client/lib/useLoading");
jest.mock("../../../src/client/lib/useSubmit");

let action = 0;

beforeEach(() => {
  // @ts-ignore
  useLoading.mockReturnValue({ loading: false, error: null });

  action = 0;
  // @ts-ignore
  useSubmit.mockImplementation(() => {
    const handleSubmit = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      action++;
    };
    const submitting = false;
    const error = undefined;
    return { handleSubmit, submitting, error };
  });
});

it("should render signup", () => {
  render(
    <MemoryRouter>
      <NewUser />
    </MemoryRouter>
  );
  screen.getByRole("heading");
  screen.getByRole("textbox", { name: "firstName:" });
  screen.getByRole("textbox", { name: "lastName:" });
  screen.getByRole("textbox", { name: "email:" });
  screen.getByText("password:");
  screen.getByText("confirm password:");

  const a = screen.getByText("create");
  userEvent.click(a);
  expect(action).toBe(1);
});
