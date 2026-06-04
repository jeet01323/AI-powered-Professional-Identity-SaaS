const User =
  require("../../models/User");

const Profile =
  require("../../models/Profile");

const Analytics =
  require("../../models/Analytics");

const Contact =
  require("../../models/Contact");


// ADMIN DASHBOARD
const getDashboardStats =
  async (req, res) => {
    try {

      // TOTAL USERS
      const totalUsers =
        await User.countDocuments();

      // PREMIUM USERS
      const premiumUsers =
        await User.countDocuments({
          isPremium: true,
        });

      // TOTAL PROFILES
      const totalProfiles =
        await Profile.countDocuments();

      // TOTAL ANALYTICS
      const totalAnalytics =
        await Analytics.countDocuments();

      // TOTAL CONTACTS
      const totalContacts =
        await Contact.countDocuments();

      // RECENT USERS
      const recentUsers =
        await User.find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            "name email createdAt"
          );


      // BASIC REVENUE
      const revenue =
        premiumUsers * 499;


      res.json({
        totalUsers,

        premiumUsers,

        totalProfiles,

        totalAnalytics,

        totalContacts,

        revenue,

        recentUsers,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

module.exports = {
  getDashboardStats,
};