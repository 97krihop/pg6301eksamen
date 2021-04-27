import { act, render, screen } from "@testing-library/react";
import React from "react";
import { Messages } from "../../../src/client/components/messages";
import { useLoading } from "../../../src/client/lib/useLoading";
import userEvent from "@testing-library/user-event";
import { useSubmit } from "../../../src/client/lib/useSubmit";
import WS from "jest-websocket-mock";

jest.mock("../../../src/client/lib/useLoading");
jest.mock("../../../src/client/lib/useSubmit");
let mockFn1 = jest.fn();
let mockFn2 = jest.fn();
beforeEach(() => {
  mockFn1.mockReset();
  mockFn2.mockReset();
  // @ts-ignore
  useLoading.mockReturnValue({
    error: null,
    loading: false,
    data: [{ email: "bob@example.com", message: "test" }],
    reload: mockFn1,
  });
  // @ts-ignore
  useSubmit.mockReturnValue({
    handleSubmit: (e: Event) => {
      e.preventDefault();
      mockFn2();
    },
    submitting: false,
    error: null,
  });
});
describe("test message component", () => {
  it("should render messages", async () => {
    act(() => {
      render(<Messages />);
    });
    const mes = screen.getByText("message:");
    const res = screen.getByText("send to:");
    screen.getByText("(email split on space)");
    const sub = screen.getByText("submit a socket message");
    const rel = screen.getByText("reload");
    await act(async () => {
      await userEvent.type(mes, "test");
      await userEvent.type(res, "test");
      await userEvent.click(rel);
      await userEvent.click(sub);
    });
    await screen.findAllByText("bob@example.com : test");
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
  it("should render loading", () => {
    // @ts-ignore
    useLoading.mockReturnValue({
      error: null,
      loading: true,
      data: [{ email: "bob@example.com", message: "test" }],
      reload: mockFn1,
    });
    act(() => {
      render(<Messages />);
    });
    screen.getByText("Loading...");
  });

  it("should render and have a websocketServer and server sends a message", async () => {
    const server = new WS("ws://localhost", { jsonProtocol: true });
    act(() => {
      render(<Messages />);
    });
    await server.connected;
    server.send({ message: { email: "test", message: "test" } });
    await screen.findByText("test : test");
    WS.clean();
  });
});
