const express = require("express");

const router = express.Router();

router.get("/profile", async (req, res) => {
  if (!req.userinfo) return res.send(401);
  return res.json(req.userinfo);
});
router.post("/login", async (req, res) => {
  if (!req.userinfo) return res.send(401);
  req.session.userId = req.userinfo.email;
  res.status(201).json({});
});
module.exports = router;
