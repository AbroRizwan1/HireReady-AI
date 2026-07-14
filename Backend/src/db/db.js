const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
