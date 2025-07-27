import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🧑🏻‍💻 Database Connected!!");
  } catch (error) {
    console.log("Something went wrong DB!!", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
