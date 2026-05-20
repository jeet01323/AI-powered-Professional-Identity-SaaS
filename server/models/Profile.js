const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // Connected User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Public Username
    username: {
      type: String,
      required: true,
      unique: true,
    },

    // Basic Info
    displayName: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
    },

    bio: {
      type: String,
    },

    location: {
      type: String,
    },

    // Profile Image
    profilePhoto: {
      type: String,
    },

    // Skills Array
    skills: [
      {
        name: String,
        category: String,
        level: String,
      },
    ],

    // Projects Array
    projects: [
      {
        title: String,

        description: String,

        techStack: [String],

        githubLink: String,

        liveLink: String,
      },
    ],

    // Social Links
    socialLinks: [
      {
        platform: String,

        url: String,
      },
    ],

    // Resume
    resumeUrl: {
      type: String,
    },

    // Theme
    themeId: {
      type: String,
      default: "default",
    },

    // Premium Feature
    customDomain: {
      type: String,
    },

    // Profile Visibility
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Profile",
  profileSchema
);