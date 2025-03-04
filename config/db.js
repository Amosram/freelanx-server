import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_STRING);
        console.log("Database Connected");
     } catch (error) {
        console.log(error)
     }
}

export default connectDB