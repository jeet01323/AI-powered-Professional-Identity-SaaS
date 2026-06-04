const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const premiumOnly =
  require("../../middleware/premiumMiddleware");


const {
  createProfile,

  getMyProfile,

  updateProfile,

  getPublicProfile,

  checkUsernameAvailability,

  getProfileSEO,

  updateTheme,

} = require(
  "../controllers/profileController"
);

const validateRequest = require("../../middleware/validateRequest");
const { createProfileSchema, updateProfileSchema } = require("../../validators");

// Create Profile
router.post(
  "/create",
  protect,
  validateRequest(createProfileSchema),
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
  validateRequest(updateProfileSchema),
  updateProfile
);


// check username availability
router.get(
  "/check-username/:username",

  checkUsernameAvailability
);
// get profile SEO
router.get(
  "/seo/:username",

  getProfileSEO
);
// update theme

router.put(
  "/theme",

  protect,

  updateTheme
);

// PREMIUM THEME
router.put(
  "/premium-theme",

  protect,

  premiumOnly,

  updateTheme
);

// Public Profile
router.get(
  "/:username",
  getPublicProfile
);

module.exports = router;
