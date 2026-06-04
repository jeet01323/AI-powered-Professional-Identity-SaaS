const dotenv = require("dotenv");

// LOAD ENV VARIABLES
dotenv.config();


// DATABASE CONNECTION
const connectDB = require("./config/db");


// EXPRESS APP
const app = require("./app");


// CONNECT DATABASE
connectDB();


// PORT
const PORT = process.env.PORT || 5000;


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});