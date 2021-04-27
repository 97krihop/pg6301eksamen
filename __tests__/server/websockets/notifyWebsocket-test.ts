const http = require("http");
const {
  wss,
  notifyRecipients,
} = require("../../../src/server/websockets/notifyWebsocket");
const server = http.createServer();
let count = 1;
server.on("upgrade", (request: Request, socket: WebSocket, head: any) => {
  wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
    const newRequest = {
      ...request,
      session: { userinfo: { email: `test${count++}` } },
    };
    wss.emit("connection", ws, newRequest);
  });
});

describe("test notification webSocket server", () => {
  beforeEach(() => {
    server.listen(0);
    count = 1;
  });

  afterEach(() => {
    server.close();
  });
  const waitForSocket = async (socket: WebSocket, state: number) => {
    return new Promise(function (resolve) {
      setTimeout(() => {
        if (socket.readyState === state) {
          resolve("");
        } else {
          waitForSocket(socket, state).then(resolve);
        }
      }, 5);
    });
  };
  jest.retryTimes(3);
  it("multiple clients should get message", async () => {
    const client1 = new WebSocket(`ws://localhost:${server.address().port}`);
    const client2 = new WebSocket(`ws://localhost:${server.address().port}`);
    const testFn = jest.fn();
    const client1Fn = jest.fn();
    const client2Fn = jest.fn();
    client1.onopen = () => {
      testFn("open");
    };
    client1.onmessage = (e) => {
      client1Fn(JSON.parse(e.data));
    };
    client2.onopen = () => {
      testFn("open");
    };
    client2.onmessage = (e) => {
      client2Fn(JSON.parse(e.data));
    };
    await waitForSocket(client1, WebSocket.OPEN);
    await waitForSocket(client2, WebSocket.OPEN);
    notifyRecipients(["test1", "test2"]);
    await waitForSocket(client1, WebSocket.OPEN);
    await waitForSocket(client2, WebSocket.OPEN);
    expect(testFn).toHaveBeenCalledTimes(2);
    expect(testFn).toHaveBeenCalledWith("open");
    expect(client1Fn).toHaveBeenCalledTimes(1);
    expect(client1Fn).toHaveBeenCalledWith({
      notification: "new notification",
    });
    expect(client2Fn).toHaveBeenCalledTimes(1);
    expect(client2Fn).toHaveBeenCalledWith({
      notification: "new notification",
    });
    client1.close();
    client2.close();
  });
});
