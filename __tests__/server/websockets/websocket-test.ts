const http = require("http");
const wss = require("../../../src/server/websockets/websocket");
const {
  notifyRecipients,
} = require("../../../src/server/websockets/notifyWebsocket");
const { clearMessages } = require("../../../src/server/db/messages");
jest.mock("../../../src/server/websockets/notifyWebsocket");
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

describe("test webSocket server", () => {
  beforeEach(() => {
    notifyRecipients.mockReturnValue(null);
    clearMessages();
    server.listen(0);
    count = 1;
  });

  afterEach(() => {
    clearMessages();
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

  it("multiple clients be able to send and receive messages", async () => {
    const client1 = new WebSocket(`ws://localhost:${server.address().port}`);
    const client2 = new WebSocket(`ws://localhost:${server.address().port}`);
    const openFn = jest.fn();
    const client1Fn = jest.fn();
    const client2Fn = jest.fn();
    client1.onopen = () => {
      openFn("open");
    };
    client1.onmessage = (e) => {
      client1Fn(JSON.parse(e.data));
    };
    client2.onopen = () => {
      openFn("open");
    };
    client2.onmessage = (e) => {
      client2Fn(JSON.parse(e.data));
    };

    await waitForSocket(client1, WebSocket.OPEN);
    await waitForSocket(client2, WebSocket.OPEN);
    await client1.send(
      JSON.stringify({ recipients: ["test2", "test3"], message: "test" })
    );
    await waitForSocket(client1, WebSocket.OPEN);
    await waitForSocket(client2, WebSocket.OPEN);

    expect(openFn).toHaveBeenCalledTimes(2);
    expect(openFn).toHaveBeenCalledWith("open");
    expect(client1Fn).toHaveBeenCalledTimes(1);
    expect(client1Fn).toHaveBeenCalledWith({
      message: { email: "test1", message: "test" },
      recipients: ["test1", "test2", "test3"],
    });
    expect(client2Fn).toHaveBeenCalledTimes(1);
    expect(client2Fn).toHaveBeenCalledWith({
      message: { email: "test1", message: "test" },
      recipients: ["test1", "test2", "test3"],
    });

    client1.close();
    client2.close();
  });
});
