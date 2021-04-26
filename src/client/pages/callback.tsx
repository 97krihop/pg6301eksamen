import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { postJson } from "../lib/http";

export function Callback() {
  const history = useHistory();
  const [error, setError] = useState();

  // @ts-ignore
  const hash = Object.fromEntries(
    new URLSearchParams(window.location.hash.substr(1))
  );

  useEffect(() => {
    handleCallback();
  }, [hash]);

  const handleCallback = async () => {
    try {
      const loginState = await JSON.parse(
        sessionStorage.getItem("loginState") as string
      );
      const { access_token, state } = hash;

      if (state !== loginState.state) {
        alert("you did not get hear legally");
        return;
      }
      await postJson(
        "/api/callback",
        {},
        { Authorization: `Bearer ${access_token}` }
      );
      sessionStorage.removeItem("loginState");
      history.push("/");
    } catch (e) {
      console.error(e);
      setError(e);
    }
  };
  if (error) {
    return <div>{error}</div>;
  }
  return <h1>Login callback</h1>;
}
