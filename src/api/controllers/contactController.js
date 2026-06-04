const Contact =
  require("../../models/Contact");

const Profile =
  require("../../models/Profile");


// SEND CONTACT MESSAGE
const sendMessage = async (
  req,
  res
) => {
  try {

    const {
      username,

      name,

      email,

      message,
    } = req.body;


    // FIND PROFILE
    const profile =
      await Profile.findOne({
        username,
      });


    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }


    // CREATE CONTACT
    const contact =
      await Contact.create({
        profileId:
          profile._id,

        name,

        email,

        message,
      });


    res.status(201).json({
      message:
        "Message sent successfully",

      contact,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// GET MY CONTACTS
const getMyContacts = async (
  req,
  res
) => {
  try {

    const profile =
      await Profile.findOne({
        userId: req.user.id,
      });


    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }


    // FIND CONTACTS
    const contacts =
      await Contact.find({
        profileId:
          profile._id,
      }).sort({
        createdAt: -1,
      });


    res.json(contacts);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  sendMessage,

  getMyContacts,
};