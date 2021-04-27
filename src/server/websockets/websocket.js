const WebSocket = require("ws");
const { notifyRecipients } = require("./notifyWebsocket");
const { createNewMessage, addMessage } = require("../db/messages");
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const map = new Map();

wss.on("connection", (ws, request) => {
  const { email } = request.session.userinfo;

  map.set(email, ws);
  console.log("email : " + email);

  ws.on("message", async (data) => {
    const { recipients: oldRecipients, message } = await JSON.parse(data);
    const recipients = [...oldRecipients, email];
    createNewMessage(JSON.stringify(recipients.sort()), recipients);
    addMessage(JSON.stringify(recipients.sort()), { email, message });
    recipients.forEach((recipient) => {
      const socket = map.get(recipient);
      if (!socket) console.log(`${recipient} dosen\`t have a socket right now`);
      else
        socket.send(
          JSON.stringify({ recipients, message: { email, message } })
        );
    });
    notifyRecipients(oldRecipients);
  });

  ws.on("close", () => {
    map.delete(email);
  });
});

module.exports = wss;
