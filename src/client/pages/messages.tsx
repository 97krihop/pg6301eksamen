import React, { useEffect, useState } from "react";
import { useLoading } from "../lib/useLoading";
import { fetchJson } from "../lib/http";
import { ErrorView } from "../components/errorView";

export const Messages = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const protocol =
      window.location.protocol.toLowerCase() === "https:" ? "wss:" : "ws:";
    if (!socket) {
      setSocket(new WebSocket(`${protocol}//${window.location.host}`));
      setConnected(true);
    }
    if (socket) {
      socket.onclose = () => {
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
  }, []);

  const { error, loading, data, reload } = useLoading(async () => {
    return await fetchJson("/api/messages/all");
  });
  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <>
        <ErrorView error={error} />
        <button onClick={reload}>reload</button>
      </>
    );
  if (data)
    return (
      <>
        <button
          onClick={() => {
            socket?.send(
              JSON.stringify({
                recipients: ["a@a.com", "97krihop@gmail.com"],
                message: "test",
              })
            );
          }}
        >
          submit a socket message
        </button>

        <div>{data.toString()}</div>
        <button onClick={reload}>reload</button>
      </>
    );

  return <></>;
};
