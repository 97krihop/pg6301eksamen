import React, { useEffect, useRef, useState } from "react";
import { useLoading } from "../lib/useLoading";
import { fetchJson } from "../lib/http";
import { ErrorView } from "./errorView";
import { InputField } from "./inputField";
import { useSubmit } from "../lib/useSubmit";

export const Messages = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const connected = useRef<boolean>(false);
  const times = useRef<number>(0);
  const { error, loading, data, reload } = useLoading(async () => {
    return await fetchJson("/api/messages/all");
  });
  const [newMessage, setNewMessage] = useState<string>("");
  const [recipients, setRecipients] = useState<string>("");

  useEffect(() => {
    wsConnect();
    return () => {
      socket?.close();
      setSocket(null);
      connected.current = false;
      times.current = 0;
    };
  }, []);
  useEffect(() => {
    if (data) setMessages(data);
  }, [data]);

  const wsConnect = () => {
    if (!socket) {
      const protocol =
        window.location.protocol.toLowerCase() === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${protocol}//${window.location.host}`);
      setSocket(ws);
      connected.current = true;

      ws.onmessage = (e) => {
        const { message } = JSON.parse(e.data);
        console.log(message);
        setMessages((prev: any) => [...prev, message]);
      };

      ws.onopen = () => {
        console.log("open");
      };
      ws.onclose = () => {
        if (times.current < 10)
          setTimeout(
            () => {
              times.current = times.current + 1;
              wsConnect();
              connected.current = false;
            },
            connected.current ? 1_000 : 10_000
          );
      };
    }
  };
  const { handleSubmit, submitting, error: postError } = useSubmit(async () => {
    socket?.send(
      JSON.stringify({
        recipients: recipients.split(" "),
        message: newMessage,
      })
    );
    setNewMessage("");
  });

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <>
        <ErrorView error={error} />
        <button onClick={reload}>reload</button>
      </>
    );
  if (messages)
    return (
      <div className={"messages"}>
        {postError && postError.toString()}
        <ul className={"list"}>
          {messages &&
            messages.map((m: { email: any; message: any }, i: React.Key) => (
              <li
                className={"messagesListItem"}
                key={i}
              >{`${m.email} : ${m.message}`}</li>
            ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <InputField
            value={newMessage}
            onValueChange={setNewMessage}
            label={"message"}
          />
          <InputField
            value={recipients}
            onValueChange={setRecipients}
            label={"send to"}
          />
          <span>(email split on space)</span>
          <br />
          <button disabled={submitting}> submit a socket message</button>
        </form>
        <button onClick={reload}>reload</button>
      </div>
    );

  return <></>;
};
