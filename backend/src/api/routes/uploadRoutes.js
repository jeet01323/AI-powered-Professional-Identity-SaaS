const express = require("express");

const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const {
  uploadFile,
  uploadProfileImage,
  uploadResume,
} = require("../../middleware/uploadMiddleware");
const {
  uploadProfilePhoto,
  uploadResumeFile,
} = require("../controllers/uploadController");

const routeUploadByType = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (req.file.mimetype.startsWith("image/")) {
    return uploadProfilePhoto(req, res);
  }

  if (req.file.mimetype === "application/pdf") {
    return uploadResumeFile(req, res);
  }

  return res.status(400).json({ message: "Unsupported file type" });
};

// GENERIC UPLOAD ROUTE
router.post("/", protect, uploadFile.single("file"), routeUploadByType);

// PROFILE PHOTO UPLOAD
router.post(
  "/profile-photo",
  protect,
  uploadProfileImage.single("file"),
  uploadProfilePhoto
);

// RESUME UPLOAD
router.post(
  "/resume",
  protect,
  uploadResume.single("file"),
  uploadResumeFile
);

module.exports = router;