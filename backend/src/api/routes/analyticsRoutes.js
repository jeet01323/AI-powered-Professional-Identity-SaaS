const express = require("express");

const router = express.Router();

const protect =
  require("../../middleware/authMiddleware");

const {
  trackEvent,

  getDashboardAnalytics,

} = require(
  "../controllers/analyticsController"
);


// TRACK EVENT
router.post(
  "/track",

  trackEvent
);


// DASHBOARD
router.get(
  "/dashboard",

  protect,

  getDashboardAnalytics
);


module.exports = router;