const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");


const {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
} = require("../controllers/profileController");


// Create Profile
router.post(
  "/create",
  protect,
  createProfile
);


// Get My Profile
router.get(
  "/me",
  protect,
  getMyProfile
);


// Update Profile
router.put(
  "/update",
  protect,
  updateProfile
);


// Public Profile
router.get(
  "/:username",
  getPublicProfile
);

module.exports = router;