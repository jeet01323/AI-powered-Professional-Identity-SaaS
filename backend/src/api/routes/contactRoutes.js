const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  sendMessage,
  getMyContacts,
} = require("../controllers/contactController");

router.post(
  "/",
  sendMessage
);

router.get(
  "/my",
  protect,
  getMyContacts
);

module.exports = router;
