const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { googleOAuth } = require("./middelware/googleOpenID");
const auth = require("./routes/auth");
const app = express();

const sessionParser = session({
  secret: "random secret",
  resave: false,
  saveUninitialized: false,
});

app.use(bodyParser.json());
app.use(sessionParser);
//static assets
app.use(express.static(path.resolve(__dirname, "..", "..", "dist")));
//google auth
app.use(googleOAuth);

app.use("/api", auth);

//react router
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.sendFile(path.resolve(__dirname, "..", "..", "dist", "index.html"));
});

module.exports = { app, sessionParser };
