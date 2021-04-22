const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: "1a230192419213",
    resave: false,
    saveUninitialized: false,
  })
);

//static assets
app.use(express.static(path.resolve(__dirname, "..", "..", "dist")));

//react router
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.sendFile(path.resolve(__dirname, "..", "..", "dist", "index.html"));
});

module.exports = app;
