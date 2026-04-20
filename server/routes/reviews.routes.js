const fs = require("fs/promises");
const fss = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../middleware/auth");
const config = require("../config");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data", "reviews.json");

function ensureDir(dir) {
  if (!fss.existsSync(dir)) fss.mkdirSync(dir, { recursive: true });
}

const reviewsUploadStorage = multer.diskStorage({
  destination(_req, file, cb) {
    const isAvatar = file.fieldname === "avatar";
    const dir = isAvatar
      ? path.join(config.rootDir, "image_work")
      : path.join(config.rootDir, "uploads", "reviews");
    ensureDir(dir);
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const safe = String(file.originalname || "file").replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const reviewsUpload = multer({
  storage: reviewsUploadStorage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

function normalizeReview(input, fallbackId) {
  const id = Number(input.id) || fallbackId;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const contact = typeof input.contact === "string" ? input.contact.trim() : "";
  const role = typeof input.role === "string" ? input.role.trim() : "";
  const quote = typeof input.quote === "string" ? input.quote.trim() : "";
  const avatar = typeof input.avatar === "string" ? input.avatar.trim() : "";
  const attachment = typeof input.attachment === "string" ? input.attachment.trim() : "";
  const reply = typeof input.reply === "string" ? input.reply.trim() : "";
  const rating = Math.min(5, Math.max(1, Number(input.rating) || 5));
  const status =
    input.status === "hidden" || input.status === "new" ? input.status : "published";
  const pinned = Boolean(input.pinned);
  const isNew = Boolean(input.isNew || status === "new");
  const date =
    typeof input.date === "string" && input.date.trim()
      ? input.date.trim()
      : new Date().toISOString();
  return {
    id,
    name,
    contact,
    role,
    quote,
    avatar,
    attachment,
    reply,
    rating,
    status,
    pinned,
    isNew,
    date,
    readAt: typeof input.readAt === "string" ? input.readAt : "",
  };
}

async function readReviews() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (_e) {
    return [];
  }
}

async function writeReviews(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

function toPublic(r) {
  return {
    id: r.id,
    rating: r.rating,
    quote: r.quote,
    name: r.name,
    role: r.role,
    avatar: r.avatar,
    reply: r.reply || "",
  };
}

router.post(
  "/submit",
  reviewsUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ]),
  async (req, res) => {
    const body = req.body || {};
    const name = String(body.name || "").trim();
    const contact = String(body.contact || "").trim();
    const quote = String(body.quote || "").trim();
    const role = String(body.role || "").trim();
    if (!name || !contact || !quote) {
      return res.status(400).json({ ok: false, error: "Заполните имя, контакт и отзыв" });
    }

    const files = req.files || {};
    const avatarFile = files.avatar && files.avatar[0];
    const attachmentFile = files.attachment && files.attachment[0];
    const avatarPath = avatarFile
      ? path.posix.join("image_work", avatarFile.filename)
      : "";
    const attachmentPath = attachmentFile
      ? path.posix.join("uploads", "reviews", attachmentFile.filename)
      : "";

    const items = await readReviews();
    const maxId = items.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
    const created = normalizeReview(
      {
        id: maxId + 1,
        name,
        contact,
        role,
        quote,
        avatar: avatarPath,
        attachment: attachmentPath,
        rating: 5,
        status: "new",
        pinned: false,
        isNew: true,
        date: new Date().toISOString(),
      },
      maxId + 1
    );
    items.unshift(created);
    await writeReviews(items);
    return res.status(201).json({ ok: true, review: created });
  }
);

router.get("/public", async (_req, res) => {
  const items = await readReviews();
  const published = items
    .filter((r) => r.status === "published")
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  res.json(published.map(toPublic));
});

router.get("/", requireAuth, async (_req, res) => {
  const items = await readReviews();
  res.json(items);
});

router.put("/:id/read", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  const items = await readReviews();
  const idx = items.findIndex((it) => Number(it.id) === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  items[idx] = { ...items[idx], isNew: false, readAt: new Date().toISOString() };
  await writeReviews(items);
  return res.json({ ok: true, review: items[idx] });
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  const items = await readReviews();
  const idx = items.findIndex((it) => Number(it.id) === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  const prev = items[idx];
  const body = req.body || {};
  const next = normalizeReview(
    {
      ...prev,
      ...body,
      id,
      isNew: false,
      readAt: prev.readAt || new Date().toISOString(),
    },
    id
  );
  items[idx] = next;
  await writeReviews(items);
  res.json(next);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  const items = await readReviews();
  const next = items.filter((it) => Number(it.id) !== id);
  if (next.length === items.length) return res.status(404).json({ ok: false, error: "Not found" });
  await writeReviews(next);
  res.json({ ok: true });
});

module.exports = router;
