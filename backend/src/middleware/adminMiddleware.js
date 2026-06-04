const User =
  require("../models/User");


// ADMIN CHECK
const adminOnly = async (
  req,
  res,
  next
) => {
  try {

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


    // NOT ADMIN
    if (!user.isAdmin) {
      return res.status(403).json({
        message:
          "Admin access required",
      });
    }


    next();

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = adminOnly;