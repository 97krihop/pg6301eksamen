const fetchJson = require("../lib/fetchJson");

const discoveryURL =
  "https://accounts.google.com/.well-known/openid-configuration";

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

module.exports = googleOAuth;
