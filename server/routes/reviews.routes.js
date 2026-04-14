const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data", "reviews.json");

function normalizeReview(input, fallbackId) {
  const id = Number(input.id) || fallbackId;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const role = typeof input.role === "string" ? input.role.trim() : "";
  const quote = typeof input.quote === "string" ? input.quote.trim() : "";
  const avatar = typeof input.avatar === "string" ? input.avatar.trim() : "";
  const reply = typeof input.reply === "string" ? input.reply.trim() : "";
  const rating = Math.min(5, Math.max(1, Number(input.rating) || 5));
  const status = input.status === "hidden" ? "hidden" : "published";
  const pinned = Boolean(input.pinned);
  const date =
    typeof input.date === "string" && input.date.trim()
      ? input.date.trim()
      : new Date().toISOString().slice(0, 10);
  return { id, name, role, quote, avatar, reply, rating, status, pinned, date };
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

router.get("/public", async (_req, res) => {
  const items = await readReviews();
  const published = items
    .filter((r) => r.status !== "hidden")
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  res.json(published.map(toPublic));
});

router.get("/", requireAuth, async (_req, res) => {
  const items = await readReviews();
  res.json(items);
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
