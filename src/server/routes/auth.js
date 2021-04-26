const express = require("express");
const {createUser} = require("../db/users")

const router = express.Router();

router.get("/profile", async (req, res) => {
  if (!req.session.userinfo) return res.send(401);
  return res.json(req.session.userinfo);
});

router.post("/signup", (req, res) => {
  if (!req.session.userinfo) return res.send(401);

  const { email, password, firstname, lastname } = req.body;

  const success = createUser(email,password,firstname,lastname);

  if (!success) {
    return res.status(401).send();
  }
  res.status(201).send()
});
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).send();
});

module.exports = router;
