import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

export const Notification = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notification, setNotification] = useState<number>(0);
  const connected = useRef<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const history = useHistory();
  useEffect(() => {
    setPaused(history.location.pathname === "/");
  }, [history.location]);

  useEffect(() => {
    startWebsocket();
    return () => {
      socket?.close();
      setSocket(null);
      connected.current = false;
    };
  }, []);

  const startWebsocket = () => {
    const protocol =
      window.location.protocol.toLowerCase() === "https:" ? "wss:" : "ws:";
    if (!socket) {
      const ws = new WebSocket(`${protocol}//${window.location.host}/notify`);
      setSocket(ws);
      connected.current = true;

      ws.onopen = () => {
        console.log("open");
      };

      ws.onmessage = (e) => {
        if (!paused) {
          const { notification } = JSON.parse(e.data);
          if (notification) setNotification((prev) => prev + 1);
        }
      };
      ws.onclose = () => {
        setTimeout(
          () => {
            startWebsocket();
            connected.current = false;
          },
          connected.current ? 1_000 : 10_000
        );
      };
    }
  };

  const clearNotification = () => {
    setNotification(0);
  };
  return (
    <>
      {notification > 0 && !paused ? (
        <div className={"notification"}>
          <button
            onClick={() => {
              clearNotification();
              history.push("/");
            }}
            className={"notification-text"}
          >
            {notification}
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
