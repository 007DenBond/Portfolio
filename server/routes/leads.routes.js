const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data", "leads.json");

async function readLeads() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (_e) {
    return [];
  }
}

async function writeLeads(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

function normalizeLead(input, fallbackId) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const contact =
    typeof input.contact === "string" && input.contact.trim()
      ? input.contact.trim()
      : email || phone || "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const now = new Date().toISOString();
  return {
    id: fallbackId,
    name,
    email,
    phone,
    contact,
    message,
    date: now,
    status: "new",
    isNew: true,
    readAt: "",
  };
}

function toCsv(items) {
  const esc = (v) => `"${String(v || "").replace(/"/g, '""')}"`;
  const rows = [["ID", "Имя", "Email", "Телефон", "Сообщение", "Дата"]];
  items.forEach((it) => {
    rows.push([it.id, it.name, it.email, it.phone, it.message, it.date]);
  });
  return rows.map((r) => r.map(esc).join(",")).join("\n");
}

router.post("/leads", async (req, res) => {
  const items = await readLeads();
  const maxId = items.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
  const lead = normalizeLead(req.body || {}, maxId + 1);
  if (!lead.name || !lead.message || (!lead.email && !lead.phone)) {
    return res.status(400).json({ ok: false, error: "Заполните имя, сообщение и email/телефон" });
  }
  items.unshift(lead);
  await writeLeads(items);
  return res.status(201).json({ ok: true, lead });
});

router.put("/leads/:id/read", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });
  const items = await readLeads();
  const idx = items.findIndex((it) => Number(it.id) === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  items[idx] = {
    ...items[idx],
    status: "read",
    isNew: false,
    readAt: new Date().toISOString(),
  };
  await writeLeads(items);
  return res.json({ ok: true, lead: items[idx] });
});

router.get("/leads", requireAuth, async (_req, res) => {
  const items = await readLeads();
  return res.json(items);
});

router.get("/leads/export.csv", requireAuth, async (_req, res) => {
  const items = await readLeads();
  const csv = toCsv(items);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=\"leads.csv\"");
  return res.send("\uFEFF" + csv);
});

module.exports = router;
