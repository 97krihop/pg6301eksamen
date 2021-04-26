const WebSocket = require('ws')
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const map = new Map();

wss.on("connection", (ws, request) => {
  const userId = request.session.userinfo;

  map.set(userId.email, ws);

  ws.on("message", (message) => {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on("close", () => {
    map.delete(userId.email);
  });
});

module.exports = wss;