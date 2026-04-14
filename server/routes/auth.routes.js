const bcrypt = require("bcrypt");
const express = require("express");
const config = require("../config");

const router = express.Router();

router.post("/login", async (req, res) => {
  const login = String(req.body.login || "").trim();
  const password = String(req.body.password || "");
  if (login !== config.adminLogin) {
    return res.status(401).json({ ok: false, error: "Неверный логин или пароль" });
  }
  try {
    const ok = await bcrypt.compare(password, config.adminPasswordHash);
    if (!ok) return res.status(401).json({ ok: false, error: "Неверный логин или пароль" });
    req.session.adminLogin = login;
    return res.json({ ok: true });
  } catch (_e) {
    return res.status(500).json({ ok: false, error: "Ошибка сервера" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session || !req.session.adminLogin) {
    return res.status(401).json({ ok: false });
  }
  return res.json({ ok: true, user: { login: req.session.adminLogin } });
});

module.exports = router;
