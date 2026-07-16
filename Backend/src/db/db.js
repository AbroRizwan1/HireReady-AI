const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    isConnected = connect.connections[0].readyState === 1;
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;