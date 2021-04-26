import React, { useEffect, useRef, useState } from "react";
import { useLoading } from "../lib/useLoading";
import { fetchJson } from "../lib/http";
import { ErrorView } from "../components/errorView";

export const Messages = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const connected = useRef<boolean>(false);
  const { error, loading, data, reload } = useLoading(async () => {
    return await fetchJson("/api/messages/all");
  });

  useEffect(() => {
    wsConnect();
    return () => {
      socket?.close();
      setSocket(null);
      connected.current = false;
    };
  }, []);

  const wsConnect = () => {
    if (!socket) {
      const protocol =
        window.location.protocol.toLowerCase() === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${protocol}//${window.location.host}`);
      setSocket(ws);
      connected.current = true;

      console.log("socket");

      ws.onmessage = (e) => {
        const { recipients, message } = JSON.parse(e.data);
        console.log(recipients, message);
        setMessages((prev: any) => [...prev, message]);
      };

      ws.onopen = () => {
        console.log("open");
      };
      ws.onclose = () => {
        setTimeout(
          () => {
            wsConnect();
            connected.current = false;
          },
          connected.current ? 1_000 : 10_000
        );
      };
    }
  };

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
        {JSON.stringify(messages)}
        <br />
        <button
          onClick={() => {
            console.log("click");
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
        <div>{JSON.stringify(data)}</div>
        <button onClick={reload}>reload</button>
      </>
    );

  return <></>;
};
