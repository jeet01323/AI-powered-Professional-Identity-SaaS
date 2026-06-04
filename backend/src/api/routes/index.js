const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const uploadRoutes = require("./uploadRoutes");
const aiRoutes = require("./aiRoutes");
const githubRoutes = require("./githubRoutes");
const qrRoutes = require("./qrRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const contactRoutes = require("./contactRoutes");

const registerRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/github", githubRoutes);
  app.use("/api/qr", qrRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/contact", contactRoutes);
};

module.exports = registerRoutes;
