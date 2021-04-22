import React from "react";
import { fetchJson, randomString } from "../lib/http";
import { IIdentityProvider } from "../index";

interface props {
  identityProvider: IIdentityProvider;
}

export const Login = ({ identityProvider }: props) => {
  const { discoveryURL, params } = identityProvider;

  async function handleLogin() {
    const { authorization_endpoint } = await fetchJson(discoveryURL);
    const state = randomString(30);
    sessionStorage.setItem("loginState", JSON.stringify({ state }));
    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams({ ...params, state });
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
