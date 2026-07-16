require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

// Sirf local development ke liye traditional server start karein
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.log("Database connection failed:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

module.exports = app;
