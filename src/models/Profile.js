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

    // Headline
headline: {
  type: String,
},

// Portfolio Website
portfolioWebsite: {
  type: String,
},

// AI Generated About
aiBio: {
  type: String,
},

// QR Code
qrCode: {
  type: String,
},

// Analytics
profileViews: {
  type: Number,
  default: 0,
},

// SEO Meta Description
seoDescription: {
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

    // projects 
   projects: [
  {
    title: String,

    description: String,

    techStack: [String],

    githubLink: String,

    liveLink: String,

    image: String,
  },
],
    // experience
    experience: [
      {
        jobTitle: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
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

    githubData: {
  username: String,

  profileUrl: String,

  avatar: String,

  followers: Number,

  following: Number,

  repositories: [
    {
      name: String,

      description: String,

      language: String,

      stars: Number,

      repoUrl: String,
    },
  ],
},

    // THEME
theme: {
  type: String,

  enum: [
    "default",
    "dark",
    "minimal",
    "modern",
    "glassmorphism",
    "developer",
    "premium",
  ],

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
