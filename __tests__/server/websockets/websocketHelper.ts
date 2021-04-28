export const waitForSocket = async (socket: WebSocket, state: number) => {
  return new Promise(function (resolve) {
    setTimeout(() => {
      if (socket.readyState === state) resolve("");
      else waitForSocket(socket, state).then(resolve);
    }, 5);
  });
};
export const waitForMessage = async (object: { received: boolean }) => {
  return new Promise(function (resolve) {
    setTimeout(() => {
      if (object.received) resolve("");
      else waitForMessage(object).then(resolve);
    }, 5);
  });
};

it("only for it to not complain", () => {});
