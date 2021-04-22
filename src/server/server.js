const https = require("https");
const http = require("http");
const fs = require("fs");
const app = require("./app");
const port = process.env.PORT || "3000";

let server;
if (fs.existsSync("server.key") && fs.existsSync("server.crt"))
  server = https.createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.crt")
    },
    app
  );
else
  server = http.createServer(app);


server.listen(port, () => {
  console.log(
    `server started on https://localhost:${port} or https://webapps.kristiania.no:${port}`
  );
});
