const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data", "contacts.json");

const DEFAULT_CONTACTS = {
  email: "prostodenbond@gmail.com",
  phone: "+7 (926) 414-50-13",
  phoneHref: "tel:+79264145013",
  telegramNick: "@Bondalet",
  telegramUrl: "https://t.me/Bondalet",
  githubUrl: "",
  instagramUrl: "",
  behanceUrl: "",
  dribbbleUrl: "",
};

async function readContacts() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const data = parsed || {};
    const pick = (key, fallback) => {
      const value = typeof data[key] === "string" ? data[key].trim() : "";
      return value || fallback;
    };
    return {
      email: pick("email", DEFAULT_CONTACTS.email),
      phone: pick("phone", DEFAULT_CONTACTS.phone),
      phoneHref: pick("phoneHref", DEFAULT_CONTACTS.phoneHref),
      telegramNick: pick("telegramNick", DEFAULT_CONTACTS.telegramNick),
      telegramUrl: pick("telegramUrl", DEFAULT_CONTACTS.telegramUrl),
      githubUrl: pick("githubUrl", DEFAULT_CONTACTS.githubUrl),
      instagramUrl: pick("instagramUrl", DEFAULT_CONTACTS.instagramUrl),
      behanceUrl: pick("behanceUrl", DEFAULT_CONTACTS.behanceUrl),
      dribbbleUrl: pick("dribbbleUrl", DEFAULT_CONTACTS.dribbbleUrl),
    };
  } catch (_e) {
    return { ...DEFAULT_CONTACTS };
  }
}

function normalizeContacts(input) {
  const data = input || {};
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const telegramNick = typeof data.telegramNick === "string" ? data.telegramNick.trim() : "";
  const telegramUrl = typeof data.telegramUrl === "string" ? data.telegramUrl.trim() : "";
  const githubUrl = typeof data.githubUrl === "string" ? data.githubUrl.trim() : "";
  const instagramUrl = typeof data.instagramUrl === "string" ? data.instagramUrl.trim() : "";
  const behanceUrl = typeof data.behanceUrl === "string" ? data.behanceUrl.trim() : "";
  const dribbbleUrl = typeof data.dribbbleUrl === "string" ? data.dribbbleUrl.trim() : "";

  const digits = phone.replace(/\D/g, "");
  const phoneHref = digits ? `tel:+${digits}` : "";

  return {
    email,
    phone,
    phoneHref,
    telegramNick,
    telegramUrl,
    githubUrl,
    instagramUrl,
    behanceUrl,
    dribbbleUrl,
  };
}

async function writeContacts(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

router.get("/contacts", async (_req, res) => {
  const contacts = await readContacts();
  return res.json({ ok: true, contacts });
});

router.get("/admin/contacts", async (_req, res) => {
  const contacts = await readContacts();
  return res.json({ ok: true, contacts });
});

router.put("/admin/contacts", requireAuth, async (req, res) => {
  const next = normalizeContacts(req.body);
  await writeContacts(next);
  return res.json({ ok: true, contacts: next });
});

module.exports = router;
