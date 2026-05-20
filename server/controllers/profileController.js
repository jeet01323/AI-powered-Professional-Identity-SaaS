const Profile = require("../models/Profile");

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

    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,

      req.body,

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


module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
};