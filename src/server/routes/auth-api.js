const express = require("express");
const { createUser, verifyUser, getUser } = require("../db/users");

const router = express.Router();

router.get("/profile", async (req, res) => {
  if (!req.session.userinfo) return res.status(401).send();

  return res.json(req.session.userinfo);
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (verifyUser(email, password)) {
    const user = getUser(email);

    req.session.userinfo = { ...user };
    req.session.userinfo.password = undefined;

    return res.status(204).send();
  }
  res.status(401).send();
});

router.post("/signup", (req, res) => {
  if (!req.session.userinfo) return res.status(401).send();

  const { email, password, firstName, lastName } = req.body;
  const success = createUser(email, password, firstName, lastName);

  if (!success) return res.status(401).send();
  res.status(201).json({});
});
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).send();
});
router.post("/callback", (req, res) => {
  const userinfo = req.session.userinfo;
  if (!userinfo) return res.status(401).send();
  if (!userinfo.given_name) return res.status(401).send();
  const {
    email,
    sub: password,
    given_name: firstname,
    family_name: lastname,
    picture
  } = userinfo;

  req.session.userinfo = {picture, email, firstname, lastname};

  const success = createUser(email, password, firstname, lastname);
  if (!success) return res.status(200).json({});
  res.status(201).json({});
});

module.exports = router;
