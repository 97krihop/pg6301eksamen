import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";

import "../../public/css.css";
import { NotFound } from "./pages/not_found";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Profile } from "./pages/profile";
import { Callback } from "./pages/callback";
import { Logout } from "./pages/logout";
import { NewUser } from "./pages/newUser";
import { Messages } from "./pages/messages";

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
  discoveryURL: "https://accounts.google.com/.well-known/openid-configuration",
  params: {
    response_type: "token",
    client_id:
      "108551637679-hvu34vf25vk1m1puoo2rhev2dv0tg7g0.apps.googleusercontent.com",
    scope: "openid email profile",
    redirect_uri: window.location.origin + "/login/callback",
  },
};

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to={"/"}>
          <button className="button">Home</button>
        </Link>
        {"  "}
        <Link to={"/profile"}>
          <button className="button">profile</button>
        </Link>
        {"  "}
        <Link to={"/login"}>
          <button className="button">Login</button>
        </Link>
        {"  "}
        <Link to={"/logout"}>
          <button className="button">logout</button>
        </Link>
        {"  "}
        <Link to={"/newUser"}>
          <button className="button">new User</button>
        </Link>
        {"  "}
        <Link to={"/messages"}>
          <button className="button">messages</button>
        </Link>
      </nav>

      <main>
        <Switch>
          <Route exact path={"/login"}>
            <Login identityProvider={googleAuth} />
          </Route>
          <Route exact path={"/logout"}>
            <Logout />
          </Route>
          <Route exact path={"/"}>
            <Home />
          </Route>
          <Route path={"/profile"}>
            <Profile />
          </Route>
          <Route path={"/newUser"}>
            <NewUser />
          </Route>
          <Route path={"/messages"}>
            <Messages />
          </Route>
          <Route path={"/login/callback"}>
            <Callback />
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
