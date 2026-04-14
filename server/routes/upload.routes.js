const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../middleware/auth");
const config = require("../config");

const router = express.Router();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dir = path.join(config.rootDir, "image_work");
    ensureDir(dir);
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const safe = String(file.originalname || "upload").replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const videoStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dir = path.join(config.rootDir, "video_work");
    ensureDir(dir);
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const safe = String(file.originalname || "upload").replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const imageUpload = multer({ storage: imageStorage, limits: { fileSize: 25 * 1024 * 1024 } });
const videoUpload = multer({ storage: videoStorage, limits: { fileSize: 200 * 1024 * 1024 } });

router.post("/image", requireAuth, imageUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "file is required" });
  const rel = path.posix.join("image_work", req.file.filename);
  return res.json({ ok: true, path: rel });
});

router.post("/video", requireAuth, videoUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "file is required" });
  const rel = path.posix.join("video_work", req.file.filename);
  return res.json({ ok: true, path: rel });
});

module.exports = router;
