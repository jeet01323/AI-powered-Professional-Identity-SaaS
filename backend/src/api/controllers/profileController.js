const Profile = require("../../models/Profile");

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {

    const {
      username,
      displayName,
      designation,
      bio,
      location,
    } = req.body;

    // Check username exists
    const existingUsername = await Profile.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // Create profile
    const profile = await Profile.create({
      userId: req.user.id,

      username,

      displayName,

      designation,

      bio,

      location,
    });

    res.status(201).json(profile);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {

    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {

    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // Whitelist fields that can be updated to prevent privilege escalation
    const allowedFields = [
      "displayName",
      "designation",
      "bio",
      "location",
      "email",
      "links",
      "social",
      "username",
      "skills",
      "projects",
      "socialLinks",
      "portfolioWebsite",
      "experience",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      updates,
      {
        new: true,
      }
    );

    res.json(updatedProfile);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE THEME
const updateTheme = async (
  req,
  res
) => {
  try {

    const { theme } = req.body;


    // FIND PROFILE
    const profile =
      await Profile.findOne({
        userId: req.user.id,
      });


    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }


    // UPDATE THEME
    profile.theme = theme;

    await profile.save();


    res.json({
      message:
        "Theme updated successfully",

      theme: profile.theme,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// PUBLIC PROFILE
const getPublicProfile = async (req, res) => {
  try {

    const profile = await Profile.findOne({
      username: req.params.username,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CHECK USERNAME AVAILABILITY
const checkUsernameAvailability =
  async (req, res) => {

    try {

      const { username } =
        req.params;


      // FIND USERNAME
      const existingProfile =
        await Profile.findOne({
          username,
        });


      // AVAILABLE
      if (!existingProfile) {
        return res.json({
          available: true,
        });
      }


      // NOT AVAILABLE
      res.json({
        available: false,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};


// GET PROFILE SEO (minimal public SEO payload)
const getProfileSEO = async (req, res) => {
  try {
    const profile = await Profile.findOne({ username: req.params.username });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      title: profile.displayName || profile.username,
      description: profile.bio || "",
      image: profile.profilePhoto || "",
      url: `${process.env.FRONTEND_URL || ""}/u/${profile.username}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,

  getMyProfile,

  updateProfile,

  getPublicProfile,

  checkUsernameAvailability,

  getProfileSEO,

  updateTheme,
};