const WebSocket = require("ws");
const { createNewMessage, addMessage } = require("./db/messages");
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const map = new Map();

wss.on("connection", (ws, request) => {
  const { email } = request.session.userinfo;

  map.set(email, ws);
  console.log("user conected " + email);


  ws.on("message", async (data) => {
    const { recipients, message } = await JSON.parse(data);

    createNewMessage(recipients.sort(), recipients);
    addMessage(recipients.sort(), { email, message });
    console.log(recipients, message);

    recipients.forEach((recipient) => {
      // if (recipient === email) return;
      const socket = map.get(recipient);
      console.log("socket");
      if (!socket) console.log(`${recipient} dosen\`t have a socket right now`);
      else
        socket.send(
          JSON.stringify({ recipients, message: { email, message } })
        );
    });
    console.log(`Received message ${data} from user ${email}`);
  });

  ws.on("close", () => {
    map.delete(email);
  });
});

module.exports = wss;
