const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data", "works.json");

function normalizeCard(input, fallbackId) {
  const id = Number(input.id) || fallbackId;
  const title =
    typeof input.title === "string" && input.title.trim()
      ? input.title.trim()
      : `Проект #${id}`;
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const category =
    typeof input.category === "string" && input.category.trim()
      ? input.category.trim()
      : "development";
  const photo =
    typeof input.photo === "string" && input.photo.trim()
      ? input.photo.trim()
      : typeof input.thumb === "string" && input.thumb.trim()
        ? input.thumb.trim()
        : Array.isArray(input.gallery) && input.gallery[0]
          ? String(input.gallery[0]).trim()
          : "";
  const video =
    typeof input.video === "string" && input.video.trim() ? input.video.trim() : "";

  const card = { id, title, description, photo, category };
  if (video) card.video = video;
  return card;
}

function migrateLegacy(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((it, idx) => normalizeCard(it || {}, idx + 1))
    .filter((it) => it.photo || it.video);
}

async function readWorks() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return migrateLegacy(data);
  } catch (_e) {
    return [];
  }
}

async function writeWorks(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

router.get("/", async (_req, res) => {
  const items = await readWorks();
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const items = await readWorks();
  const maxId = items.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
  const card = normalizeCard(req.body || {}, maxId + 1);
  if (!card.photo && !card.video) {
    return res.status(400).json({ ok: false, error: "photo or video is required" });
  }
  items.push(card);
  await writeWorks(items);
  res.status(201).json(card);
});

router.put("/reorder", requireAuth, async (req, res) => {
  const ids = Array.isArray(req.body) ? req.body : req.body && Array.isArray(req.body.ids) ? req.body.ids : null;
  if (!ids) return res.status(400).json({ ok: false, error: "ids array is required" });

  const normalizedIds = ids.map((v) => Number(v)).filter((v) => Number.isFinite(v));
  const uniqueIds = Array.from(new Set(normalizedIds));
  const items = await readWorks();
  if (uniqueIds.length !== items.length) return res.status(400).json({ ok: false, error: "ids length mismatch" });

  const byId = new Map(items.map((it) => [Number(it.id), it]));
  if (uniqueIds.some((id) => !byId.has(id))) return res.status(400).json({ ok: false, error: "ids contain unknown cards" });
  await writeWorks(uniqueIds.map((id) => byId.get(id)));
  return res.json({ ok: true });
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  const items = await readWorks();
  const idx = items.findIndex((it) => Number(it.id) === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Card not found" });

  const card = normalizeCard({ ...items[idx], ...(req.body || {}), id }, id);
  if (!card.photo && !card.video) {
    return res.status(400).json({ ok: false, error: "photo or video is required" });
  }
  items[idx] = card;
  await writeWorks(items);
  res.json(card);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  const items = await readWorks();
  const next = items.filter((it) => Number(it.id) !== id);
  if (next.length === items.length) return res.status(404).json({ ok: false, error: "Card not found" });
  await writeWorks(next);
  res.json({ ok: true });
});

module.exports = router;
