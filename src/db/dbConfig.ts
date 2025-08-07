import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;
        
        connection.on("connected", () => {
            console.log("MongoDB connected");
        });

        connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
            process.exit(1);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
