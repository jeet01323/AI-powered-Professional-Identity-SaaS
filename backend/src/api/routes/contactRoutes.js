const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  submitContactMessage,
  getMyContactMessages,
} = require("../controllers/contactController");

router.post(
  "/",
  submitContactMessage
);

router.get(
  "/my",
  protect,
  getMyContactMessages
);

module.exports = router;
