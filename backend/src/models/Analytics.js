const mongoose = require("mongoose");

const analyticsSchema =
  new mongoose.Schema(
    {
      profileId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Profile",

        required: true,
      },

      eventType: {
        type: String,

        enum: [
          "profile_view",
          "qr_scan",
          "resume_download",
          "contact_click",
        ],

        required: true,
      },

      // VISITOR IP
      visitorIp: {
        type: String,
      },

      // DEVICE INFO
      userAgent: {
        type: String,
      },

      // BROWSER
      browser: {
        type: String,
      },

      // DEVICE TYPE
      deviceType: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Analytics",
    analyticsSchema
  );