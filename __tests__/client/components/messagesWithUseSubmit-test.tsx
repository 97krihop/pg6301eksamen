import WS from "jest-websocket-mock";
import { act, render, screen } from "@testing-library/react";
import { Messages } from "../../../src/client/components/messages";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useLoading } from "../../../src/client/lib/useLoading";

jest.mock("../../../src/client/lib/useLoading");
let mockFn1 = jest.fn();
beforeEach(() => {
  mockFn1.mockReset();
  // @ts-ignore
  useLoading.mockReturnValue({
    error: null,
    loading: false,
    data: [{ email: "bob@example.com", message: "test" }],
    reload: mockFn1,
  });
});
it("should render and have a websocketServer", async () => {
  const server = new WS("ws://localhost", { jsonProtocol: true });
  act(() => {
    render(<Messages />);
  });
  await server.connected;
  const mes = screen.getByText("message:");
  const res = screen.getByText("send to:");
  screen.getByText("(email split on space)");
  const sub = screen.getByText("submit a socket message");
  screen.getByText("reload");
  await act(async () => {
    await userEvent.type(mes, "t");
    await userEvent.type(res, "t");
    await userEvent.click(sub);
  });

  server.send({ message: { email: "test", message: "test" } });
  await screen.findByText("test : test");
  await expect(server).toReceiveMessage({ recipients: ["t"], message: "t" });
  server.error();
});
