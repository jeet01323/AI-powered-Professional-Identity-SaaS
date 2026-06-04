const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  generateBio,

  reviewPortfolio,

} = require(
  "../controllers/aiController"
);


// Generate AI Bio
router.post(
  "/generate-bio",
  protect,
  generateBio
);


// AI PORTFOLIO REVIEW
router.get(
  "/review",

  protect,

  reviewPortfolio
);


module.exports = router;
