const https = require("https");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const { sessionParser, app } = require("./app");
const port = process.env.PORT || "3000";

const server =
  fs.existsSync("server.key") && fs.existsSync("server.crt")
    ? https.createServer(
        {
          key: fs.readFileSync("server.key"),
          cert: fs.readFileSync("server.crt"),
        },
        app
      )
    : http.createServer(app);

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on("upgrade", (request, socket, head) => {
  console.log("Parsing session from request...");
  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    console.log("Session is parsed!");

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
});
wss.on("connection", (ws, request) => {
  const userId = request.session.userId;

  //map.set(userId, ws);

  ws.on("message", (message) => {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on("close", () => {
    // map.delete(userId);
  });
});

server.listen(port, () => {
  console.log(
    `server started on https://localhost:${port} or https://webapps.kristiania.no:${port}`
  );
});
