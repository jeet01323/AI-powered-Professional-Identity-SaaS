const Analytics =
  require("../../models/Analytics");

const Profile =
  require("../../models/Profile");


// TRACK EVENT
const trackEvent = async (
  req,
  res
) => {
  try {

    const {
      username,

      eventType,
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


    // USER AGENT
    const userAgent =
      req.headers["user-agent"];


    // DEVICE TYPE
    const deviceType =
      userAgent.includes("Mobile")
        ? "Mobile"
        : "Desktop";


    // SIMPLE BROWSER DETECTION
    let browser = "Unknown";

    if (
      userAgent.includes("Chrome")
    ) {
      browser = "Chrome";
    } else if (
      userAgent.includes("Firefox")
    ) {
      browser = "Firefox";
    } else if (
      userAgent.includes("Safari")
    ) {
      browser = "Safari";
    }


    // CREATE EVENT
    await Analytics.create({
      profileId:
        profile._id,

      eventType,

      visitorIp: req.ip,

      userAgent,

      browser,

      deviceType,
    });


    res.json({
      message:
        "Analytics tracked successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// DASHBOARD ANALYTICS
const getDashboardAnalytics =
  async (req, res) => {
    try {

      // FIND PROFILE
      const profile =
        await Profile.findOne({
          userId:
            req.user.id,
        });


      if (!profile) {
        return res.status(404).json({
          message:
            "Profile not found",
        });
      }


      // TOTAL VIEWS
      const totalViews =
        await Analytics.countDocuments({
          profileId:
            profile._id,

          eventType:
            "profile_view",
        });


      // UNIQUE VISITORS
      const uniqueVisitors =
        await Analytics.distinct(
          "visitorIp",
          {
            profileId:
              profile._id,
          }
        );


      // QR SCANS
      const qrScans =
        await Analytics.countDocuments({
          profileId:
            profile._id,

          eventType:
            "qr_scan",
        });


      // RESUME DOWNLOADS
      const resumeDownloads =
        await Analytics.countDocuments({
          profileId:
            profile._id,

          eventType:
            "resume_download",
        });


      // CONTACT CLICKS
      const contactClicks =
        await Analytics.countDocuments({
          profileId:
            profile._id,

          eventType:
            "contact_click",
        });


      // RECENT EVENTS
      const recentActivity =
        await Analytics.find({
          profileId:
            profile._id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(10);


      res.json({
        totalViews,

        uniqueVisitors:
          uniqueVisitors.length,

        qrScans,

        resumeDownloads,

        contactClicks,

        recentActivity,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

module.exports = {
  trackEvent,

  getDashboardAnalytics,
};