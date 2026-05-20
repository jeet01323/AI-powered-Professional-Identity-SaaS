const Profile = require("../models/Profile");


// Upload Profile Photo
const uploadProfilePhoto = async (req, res) => {
  try {

    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.profilePhoto = req.file.path;

    await profile.save();

    res.json({
      message: "Profile photo uploaded",
      imageUrl: req.file.path,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// Upload Resume
const uploadResumeFile = async (req, res) => {
  try {

    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.resumeUrl = req.file.path;

    await profile.save();

    res.json({
      message: "Resume uploaded",
      resumeUrl: req.file.path,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  uploadProfilePhoto,
  uploadResumeFile,
};