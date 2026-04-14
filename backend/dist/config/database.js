import mongoose from "mongoose";
import env from "./config.js";
const connectDB = async () => {
    try {
        if (!env.MONGO_URI) {
            throw new Error("MONGO_URI is required to connect to MongoDB");
        }
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB connected successfully 💾");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
