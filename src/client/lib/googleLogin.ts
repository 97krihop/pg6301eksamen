import { fetchJson, randomString } from "./http";
import { IIdentityProvider } from "../index";

// @ts-ignore
export const googleLogin = async (identityProvider: IIdentityProvider) => {
  const { discoveryURL, params } = identityProvider;
  const { authorization_endpoint } = await fetchJson(discoveryURL);
  const state = randomString(30);
  sessionStorage.setItem("loginState", JSON.stringify({ state }));
  window.location.assign(
    authorization_endpoint + "?" + new URLSearchParams({ ...params, state })
  );
};
