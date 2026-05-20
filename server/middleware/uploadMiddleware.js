const multer = require("multer");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");


// Profile Image Storage
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "devcard/profile-images",

    allowed_formats: ["jpg", "jpeg", "png"],
  },
});


// Resume Storage
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "devcard/resumes",

    allowed_formats: ["pdf"],
  },
});


// Upload Middlewares
const uploadProfileImage = multer({
  storage: profileStorage,
});

const uploadResume = multer({
  storage: resumeStorage,
});


module.exports = {
  uploadProfileImage,
  uploadResume,
};