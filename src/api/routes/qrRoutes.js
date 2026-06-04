const express = require("express");

const router = express.Router();

const {
  generateQRCode,
} = require("../controllers/qrController");


// Generate QR
router.get(
  "/:username",

  generateQRCode
);


module.exports = router;
