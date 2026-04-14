const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/:key", requireAuth, (req, res) => {
  res.json({
    ok: true,
    key: req.params.key,
    ru: { title: "", description: "" },
    en: { title: "", description: "" },
  });
});

router.put("/:key", requireAuth, (req, res) => {
  res.json({ ok: true, key: req.params.key });
});

module.exports = router;
