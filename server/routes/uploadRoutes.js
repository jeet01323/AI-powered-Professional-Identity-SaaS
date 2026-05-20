const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  uploadProfileImage,
  uploadResume,
} = require("../middleware/uploadMiddleware");

const {
  uploadProfilePhoto,
  uploadResumeFile,
} = require("../controllers/uploadController");


// Upload Profile Photo
router.post(
  "/profile-photo",
  protect,
  uploadProfileImage.single("image"),
  uploadProfilePhoto
);


// Upload Resume
router.post(
  "/resume",
  protect,
  uploadResume.single("resume"),
  uploadResumeFile
);


module.exports = router;