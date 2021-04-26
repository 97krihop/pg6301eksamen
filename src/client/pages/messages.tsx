import React, { useEffect, useRef, useState } from "react";
import { useLoading } from "../lib/useLoading";
import { fetchJson } from "../lib/http";
import { ErrorView } from "../components/errorView";
import { InputField } from "../components/inputField";
import { useSubmit } from "../lib/useSubmit";

export const Messages = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const connected = useRef<boolean>(false);
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
    };
  }, []);
  useEffect(() => {
    if (data) setMessages(data);
    console.log(messages);
  }, [data]);

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
      <>
        {postError && postError.toString()}
        <ul>
          {messages &&
            messages.map((m: { email: any; message: any }, i: React.Key) => (
              <li
                className={"messagesList"}
                key={i}
              >{`${m.email} : ${m.message}`}</li>
            ))}
        </ul>
        <br />
        <form onSubmit={handleSubmit}>
          <InputField
            value={newMessage}
            onValueChange={setNewMessage}
            label={"message"}
          />
          <InputField
            value={recipients}
            onValueChange={setRecipients}
            label={"send to(email split on space)"}
          />
          <button disabled={submitting}> submit a socket message</button>
        </form>
        <br />
        <button onClick={reload}>reload</button>
      </>
    );

  return <></>;
};
