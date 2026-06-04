const mongoose = require("mongoose");

const contactSchema =
  new mongoose.Schema(
    {
      profileId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Profile",

        required: true,
      },

      name: {
        type: String,

        required: true,
      },

      email: {
        type: String,

        required: true,
      },

      message: {
        type: String,

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Contact",
    contactSchema
  );