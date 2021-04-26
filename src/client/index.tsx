import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";

import "../../public/css.css";
import { NotFound } from "./pages/not_found";
import { Home } from "./pages/home";
import { fetchJson } from "./lib/http";
import { Login } from "./pages/login";
import { Profile } from "./pages/profile";
import { useLocalStorage } from "./lib/useLocalStorage";
import { Callback } from "./pages/callback";

export interface IIdentityProvider {
  discoveryURL: string;
  params: {
    response_type: string;
    client_id: string;
    scope: string;
    redirect_uri: string;
    state?: string;
  };
}
const googleAuth: IIdentityProvider = {
  discoveryURL:
    "https://accounts.google.com/.well-known/openid-configuration",
  params: {
    response_type: "token",
    client_id:
      "108551637679-hvu34vf25vk1m1puoo2rhev2dv0tg7g0.apps.googleusercontent.com",
    scope: "openid email profile",
    redirect_uri: window.location.origin + "/login/callback",
  },
};

const App = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [access_token, setAccess_token] = useLocalStorage("access_token");

  useEffect(() => {
    const protocol =
      window.location.protocol.toLowerCase() === "https:" ? "wss:" : "ws:";
    if (!socket) {
      setSocket(new WebSocket(`${protocol}//${window.location.host}`));
      setConnected(true);
    }
    if (socket) {
      socket.onclose = (closeEvent) => {
        setTimeout(
          () => {
            setSocket(new WebSocket(`${protocol}//${window.location.host}`));
            setConnected(true);
          },
          connected ? 1_000 : 10_000
        );
      };
    }
    return () => {
      socket?.close();
      setSocket(null);
    };
  }, [access_token]);

  const loadProfile = async (): Promise<{ name: string; picture: string }> => {
    return await fetchJson("/api/profile", {
      headers: {
        ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
      },
    });
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to={"/"}>
          <button className="button">Home</button>
        </Link>{" "}
        <Link to={"/profile"}>
          <button className="button">profile</button>
        </Link>
        {"  "}
        <Link to={"/login"}>
          <button className="button">Login</button>
        </Link>
      </nav>
      <main>
        <Switch>
          <Route exact path={"/login"}>
            <Login identityProvider={googleAuth} />
          </Route>
          <Route exact path={"/"}>
            <Home />
          </Route>
          <Route path={"/profile"}>
            <Profile loadProfile={loadProfile} />
          </Route>
          <Route path={"/login/callback"}>
            <Callback
              onAccessToken={(access_token) => setAccess_token(access_token)}
            />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
