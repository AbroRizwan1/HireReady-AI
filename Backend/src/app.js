const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://hire-ready-ai-gncs.vercel.app",
    credentials: true,
  }),
);

// ✅ middleware checks every request 
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.log("DB connection error:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// require all Router here
const authRouter = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.routes");

// usering All The route Here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
