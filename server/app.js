const path = require("path");
const express = require("express");
const session = require("express-session");

const config = require("./config");
const authRoutes = require("./routes/auth.routes");
const worksRoutes = require("./routes/works.routes");
const uploadRoutes = require("./routes/upload.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const adminTranslationsRoutes = require("./routes/admin-translations.routes");
const contactsRoutes = require("./routes/contacts.routes");
const leadsRoutes = require("./routes/leads.routes");
const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    name: config.sessionName,
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.isProduction,
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/works", worksRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin/translations", adminTranslationsRoutes);
app.use("/api", contactsRoutes);
app.use("/api", leadsRoutes);

app.use("/admin/api", requireAuth, (req, res) => {
  res.json({
    ok: true,
    message: "Admin route is protected",
    user: { login: req.session.adminLogin || config.adminLogin },
  });
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(config.rootDir, "admin", "index.html"));
});

app.get("/admin/index.html", (req, res) => {
  res.sendFile(path.join(config.rootDir, "admin", "index.html"));
});

app.get("/admin/*", requireAuth, (req, res) => {
  res.sendFile(path.join(config.rootDir, "admin", "index.html"));
});

app.use(express.static(config.rootDir, { extensions: ["html"] }));

app.get("*", (req, res) => {
  res.sendFile(path.join(config.rootDir, "index.html"));
});

app.listen(config.port, () => {
  console.log(`Server started on http://localhost:${config.port}`);
});
