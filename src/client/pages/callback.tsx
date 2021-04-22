import React, { useEffect } from "react";
import { useHistory } from "react-router";

export function Callback({
  onAccessToken,
}: {
  onAccessToken: (x: string) => void;
}) {
  // @ts-ignore
  const hash = Object.fromEntries(
    new URLSearchParams(window.location.hash.substr(1))
  );

  const history = useHistory();

  useEffect(() => {
    const loginState = JSON.parse(
      sessionStorage.getItem("loginState") as string
    );
    const { access_token, state } = hash;

    if (state !== loginState.state) {
      alert("you did not get hear legally");
      return;
    }
    onAccessToken(access_token);
    // TODO: I'll keep this for now for debugging
    //sessionStorage.removeItem("loginState");
    history.push("/");
  }, [hash]);

  return <h1>Login callback</h1>;
}
