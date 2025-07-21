import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("🧑🏻‍💻 Database Connected!!", connect.connection.host);
  } catch (error) {
    console.log("Something went wrong DB!!", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
