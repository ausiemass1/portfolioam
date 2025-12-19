import mongoose from "mongoose";

const connectDB = async () => {
  const dbURL = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

  try {
    await mongoose.connect(dbURL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;

