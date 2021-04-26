const express = require("express");
const { createUser } = require("../db/users");

const router = express.Router();

router.get("/profile", async (req, res) => {
  if (!req.session.userinfo) return res.send(401);
  return res.json(req.session.userinfo);
});

router.post("/signup", (req, res) => {
  if (!req.session.userinfo) return res.send(401);

  const { email, password, firstname, lastname } = req.body;

  const success = createUser(email, password, firstname, lastname);

  if (!success)
    return res.status(401).send();
  res.status(201).send();
});
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).send();
});
router.post("/callback", (req, res) => {
  const userinfo = req.session.userinfo;
  if (!userinfo) return res.send(401);
  const {
    email,
    sub: password,
    given_name: firstname,
    family_name: lastname,
  } = userinfo;
  const success = createUser(email, password, firstname, lastname);
  if (!success)
    return res.status(200).json({});
  res.status(201).json({});
});

module.exports = router;
