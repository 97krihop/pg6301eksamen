const fetch = require("node-fetch");

const discoveryURL =
  "https://accounts.google.com/.well-known/openid-configuration";

const fetchJson = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok)
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return await res.json();
};

const googleOAuth = async (req, res, next) => {
  const Authorization = req.header("Authorization");
  if (Authorization) {
    const { userinfo_endpoint } = await fetchJson(discoveryURL);
    req.session.userinfo = await fetchJson(userinfo_endpoint, {
      headers: {
        Authorization,
      },
    });
  }
  next();
};

module.exports = { fetchJson, googleOAuth };