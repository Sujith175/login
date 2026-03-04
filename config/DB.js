import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoose connected");
  } catch (error) {
    console.log("connection error", error);
    process.exit(1);
  }
};

export default connectDB;
