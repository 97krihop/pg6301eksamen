import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";

import "../../public/css.css";
import { NotFound } from "./pages/not_found";
import { Home } from "./pages/home";
import { Login } from "./pages/login";

const App = () => {
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

  return (
    <BrowserRouter>
      <nav>
        <Link to={"/"}>
          <button className="button">Home</button>
        </Link>
        {"  "}
        <Link to={"/login"}>
          <button className="button">Login</button>
        </Link>
        {"  "}
      </nav>
      <main>
        <Switch>
          <Route path={"/login"}>
            <Login />
          </Route>
          <Route exact path={"/"}>
            <Home />
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
