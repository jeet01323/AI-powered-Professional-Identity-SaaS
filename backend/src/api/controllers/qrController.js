const QRCode = require("qrcode");


// Generate QR Code
const generateQRCode = async (req, res) => {
  try {

    const { username } = req.params;


    // Public Profile URL
    const profileUrl =
      `http://localhost:3000/${username}`;


    // Generate QR
    const qrImage =
      await QRCode.toDataURL(profileUrl);


    res.json({
      profileUrl,
      qrCode: qrImage,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  generateQRCode,
};
