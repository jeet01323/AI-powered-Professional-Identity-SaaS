const Profile = require("../../models/Profile");

const findProfileByUserId = (userId) =>
  Profile.findOne({
    userId,
  });

const ensureFileUploaded = (req, res) => {
  if (!req.file) {
    res.status(400).json({
      message: "No file uploaded",
    });

    return false;
  }

  return true;
};

const buildFileUrl = (req, filePath) => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${normalizedPath}`;
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!ensureFileUploaded(req, res)) {
      return;
    }

    const profile = await findProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.profilePhoto = buildFileUrl(req, req.file.path);
    await profile.save();

    return res.json({
      message: "Profile photo uploaded successfully",
      profilePhoto: profile.profilePhoto,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const uploadResumeFile = async (req, res) => {
  try {
    if (!ensureFileUploaded(req, res)) {
      return;
    }

    const profile = await findProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.resumeUrl = buildFileUrl(req, req.file.path);
    await profile.save();

    return res.json({
      message: "Resume uploaded successfully",
      resumeUrl: profile.resumeUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadProfilePhoto,
  uploadResumeFile,
};
