import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Login } from "../../../src/client/pages/login";
import userEvent from "@testing-library/user-event";
import { IIdentityProvider } from "../../../src/client";
import { useSubmit } from "../../../src/client/lib/useSubmit";
import { googleLogin } from "../../../src/client/lib/googleLogin";

jest.mock("../../../src/client/lib/googleLogin");
jest.mock("../../../src/client/lib/useSubmit");

let count = 0;
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  count++;
};

beforeEach(() => {
  jest.resetAllMocks();
  // @ts-ignore
  useSubmit.mockReturnValue({ handleSubmit, loading: false, error: null });
  // @ts-ignore
  googleLogin.mockReturnValue(null);
});
const googleAuth: IIdentityProvider = {
  discoveryURL: "https://accounts.google.com/.well-known/openid-configuration",
  params: {
    response_type: "token",
    client_id: "",
    scope: "openid email profile",
    redirect_uri: "/login/callback",
  },
};

it("should render login", () => {
  render(
    <MemoryRouter>
      <Login identityProvider={googleAuth} />
    </MemoryRouter>
  );

  screen.getByRole("heading");
  screen.getByRole("textbox", { name: "username:" });
  const a = screen.getByText("Log in");
  userEvent.click(a);
  const b = screen.getByText("login with google");
  userEvent.click(b);
  expect(useSubmit).toHaveBeenCalledTimes(1);
  expect(googleLogin).toHaveBeenCalledTimes(1);
  expect(count).toBe(1);
});
