import { fetchJson } from "../../../src/client/lib/http";
import { IIdentityProvider } from "../../../src/client";
import { googleLogin } from "../../../src/client/lib/googleLogin";

jest.mock("../../../src/client/lib/http");

jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();
let assignMock = jest.fn();
beforeEach(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { assign: assignMock };
  // @ts-ignore
  fetchJson.mockReturnValue({ authorization_endpoint: "test" });
});

afterEach(() => {
  assignMock.mockClear();
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
it("should run google login", async () => {
  await googleLogin(googleAuth);
  expect(window.localStorage.__proto__.setItem).toHaveBeenCalledTimes(1);
  expect(assignMock).toHaveBeenCalledTimes(1);
});
