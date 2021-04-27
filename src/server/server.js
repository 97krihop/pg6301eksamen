const https = require("https");
const http = require("http");
const fs = require("fs");
const wss = require("./websockets/websocket");
const { wss: notifyWss } = require("./websockets/notifyWebsocket");
const url = require("url");
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

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  sessionParser(request, {}, () => {
    if (!request.session.userinfo) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    if (pathname === "/notify") {
      notifyWss.handleUpgrade(request, socket, head, (ws) => {
        notifyWss.emit("connection", ws, request);
      });
    } else {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });
});

server.listen(port, () => {
  console.log(
    `server started on https://localhost:${port} or https://webapps.kristiania.no:${port}`
  );
});
