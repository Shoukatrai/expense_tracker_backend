import mongoose from "mongoose";
export const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB Error", error);
  }
};
