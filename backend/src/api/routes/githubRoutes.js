const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  connectGitHub,
} = require("../controllers/githubController");


// Connect GitHub
router.post(
  "/connect",
  protect,
  connectGitHub
);

module.exports = router;
