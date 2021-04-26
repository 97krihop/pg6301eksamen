const WebSocket = require("ws");
const { createNewMessage, addMessage } = require("./db/messages");
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const map = new Map();

wss.on("connection", (ws, request) => {
  const { email } = request.session.userinfo;

  map.set(email, ws);

  ws.on("message", async (data) => {
    const { recipients, message } = data.toJSON();
    createNewMessage(recipients.sort(), [email, ...recipients]);
    addMessage(recipients.sort(), { email, message });

    recipients.forEach((recipient) => {
      if (recipients === email) return;
      const socket = map.get(request);
      if (!socket) console.log(`${recipient} dosen\`t have a socket right now`);

      socket.send(JSON.stringify({ recipients, message: { email, message } }));
    });
    console.log(`Received message ${data} from user ${email}`);
  });

  ws.on("close", () => {
    map.delete(email);
  });
});

module.exports = wss;
