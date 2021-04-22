const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const fetch = require("node-fetch");

const app = express();

const discoveryURL =
  "https://accounts.google.com/.well-known/openid-configuration";

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

app.use(async (req, res, next) => {
  const Authorization = req.header("Authorization");
  if (Authorization) {
    const { userinfo_endpoint } = await fetchJson(discoveryURL);
    req.userinfo = await fetchJson(userinfo_endpoint, {
      headers: {
        Authorization,
      },
    });
  }
  next();
});

app.get("/api/profile", async (req, res) => {
  if (!req.userinfo) return res.send(401);
  return res.json(req.userinfo);
});

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
