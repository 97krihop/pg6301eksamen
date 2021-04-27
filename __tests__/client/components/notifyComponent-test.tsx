import WS from "jest-websocket-mock";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Notification } from "../../../src/client/components/notifyComponent";
import React from "react";
import userEvent from "@testing-library/user-event";

it("should render notify", async () => {
  const history = createMemoryHistory();
  history.push("/something");
  const server = new WS("ws://localhost/notify", { jsonProtocol: true });
  render(
    <Router history={history}>
      <Notification />
    </Router>
  );
  await server.connected;
  await server.send({ notification: "something" });
  await screen.findByText("1");
  await server.send({ notification: "something" });
  const b = await screen.findByText("2");
  await userEvent.click(b);
  expect(history.location.pathname).toBe("/");
  history.push("/something");
  await server.send({ notification: "something" });
  await screen.findByText("1");
});
