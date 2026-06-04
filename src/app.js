const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const path = require("path");


// ROUTES
const authRoutes =
  require("./api/routes/authRoutes");

const profileRoutes =
  require("./api/routes/profileRoutes");

const uploadRoutes =
  require("./api/routes/uploadRoutes");

const aiRoutes =
  require("./api/routes/aiRoutes");

const githubRoutes =
  require("./api/routes/githubRoutes");

const qrRoutes =
  require("./api/routes/qrRoutes");

const analyticsRoutes =
  require("./api/routes/analyticsRoutes");

const paymentRoutes =
  require("./api/routes/paymentRoutes");

const contactRoutes =
  require("./api/routes/contactRoutes");

const adminRoutes =
  require("./api/routes/adminRoutes");


// EXPRESS APP
const app = express();


// MIDDLEWARE
const { authLimiter, aiLimiter } = require("./middleware/rateLimiter");

app.use(helmet());
app.use(compression());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].filter(Boolean);

let corsOptions;
if (process.env.NODE_ENV === 'production') {
  corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: origin not allowed'));
      }
    },
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
} else {
  // In development, skip the cors() middleware and manually echo headers
  app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
}

app.use(express.json());

app.use(
  "/uploads",

  express.static(
    path.join(__dirname, "../uploads")
  )
);


// API ROUTES
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/ai", aiLimiter, aiRoutes);

app.use("/api/github", githubRoutes);

app.use("/api/qr", qrRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/admin", adminRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("DevCard AI Backend Running");
});

// HEALTH CHECK ROUTE
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

module.exports = app;