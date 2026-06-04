const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  sendMessage,
  getMyContacts,
} = require("../controllers/contactController");

const validateRequest = require("../../middleware/validateRequest");
const { contactSchema } = require("../../validators");

router.post(
  "/",
  validateRequest(contactSchema),
  sendMessage
);

router.get(
  "/my",
  protect,
  getMyContacts
);

module.exports = router;
