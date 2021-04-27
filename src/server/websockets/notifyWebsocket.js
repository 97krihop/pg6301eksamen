const WebSocket = require("ws");
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const map = new Map();
const notifyRecipients = (recipients) => {
  recipients.forEach((recipient) => {
    const socket = map.get(recipient);
    if (socket)
      socket.send(JSON.stringify({ notification: "new notification" }));
    else {
      console.log(`${recipient}s socket is not available. trying again later`);
    }
  });
};

wss.on("connection", (ws, request) => {
  const { email } = request.session.userinfo;

  map.set(email, ws);

  ws.on("close", () => {
    map.delete(email);
  });
});

module.exports = { wss, notifyRecipients };
