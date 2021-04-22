import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";

import "../../public/css.css";
import { NotFound } from "./pages/not_found";
import { Home } from "./pages/home";
import { fetchJson } from "./lib/http";
import { Login } from "./pages/Login";
import { Callback } from "./pages/callback";
import { Profile } from "./pages/profile";

export interface IIdentityProvider {
  discoveryURL: string;
  client_id: string;
  params: {
    response_type: string;
    client_id: string;
    scope: string;
    redirect_uri: string;
    state?: string;
  };
}

const App = () => {
  /*
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    const protocol =
      window.location.protocol.toLowerCase() === "https:" ? "wss:" : "ws:";
    if (!socket)
      setSocket(new WebSocket(`${protocol}//${window.location.host}`));
    return () => {
      socket?.close();
      setSocket(undefined);
    };
  }, []);
*/
  const [access_token, setAccess_token] = useState<null | string>(null);
  const googleAuth: IIdentityProvider = {
    client_id:
      "108551637679-hvu34vf25vk1m1puoo2rhev2dv0tg7g0.apps.googleusercontent.com",
    discoveryURL:
      " https://accounts.google.com/.well-known/openid-configuration",
    params: {
      response_type: "token",
      client_id:
        "108551637679-hvu34vf25vk1m1puoo2rhev2dv0tg7g0.apps.googleusercontent.com",
      scope: "openid email profile",
      redirect_uri: window.location.origin + "/login/callback/google",
    },
  };

  const loadProfile = async (): Promise<{ name: string; picture: string }> =>{
    return await fetchJson("/api/profile", {
      headers: {
        ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
      },
    });}

  return (
    <BrowserRouter>
      <nav>
        <Link to={"/"}>
          <button className="button">Home</button>
        </Link>
        {" "}
        <Link to={"/profile"}>
          <button className="button">profile</button>
        </Link>
        {"  "}
        <Link to={"/login"}>
          <button className="button">Login</button>
        </Link>
        {"  "}
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
          <Route path={"/login/callback/google"}>
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
