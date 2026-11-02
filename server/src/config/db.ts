import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1); // sin base de datos la API no sirve: cortamos
  }
}

export { connectDB };
