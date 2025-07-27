import express from "express";
import http from "http";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";
import ConnectDB from "./config/ConnectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/posts.route.js";
import followUpRouter from "./routes/followUp.route.js";
import notificationRouter from "./routes/notification.route.js";
import { initSocketIO } from "./utils/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://hire-track-nine.vercel.app"]
    : ["http://localhost:5173"];

// Middleware
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// Router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/followup", followUpRouter);
app.use("/api/v1/notifications", notificationRouter);

app.get("/", (req, res) => {
  res.send("🎉 HireTracker Backend is Live");
});

//Global Error Handeling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

server.listen(PORT, async () => {
  await ConnectDB();
  initSocketIO(server);
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
