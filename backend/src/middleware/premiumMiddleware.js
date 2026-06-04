const User =
  require("../models/User");


// PREMIUM CHECK
const premiumOnly = async (
  req,
  res,
  next
) => {
  try {

    // FIND USER
    const user =
      await User.findById(
        req.user.id
      );


    // USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // NOT PREMIUM
    if (!user.isPremium) {
      return res.status(403).json({
        message:
          "Premium subscription required",
      });
    }


    // ALLOW ACCESS
    next();

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = premiumOnly;