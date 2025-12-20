import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import reviewRouter from "./routes/reviewRoute.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import restaurantOrderRouter from "./routes/restaurantOrderRoute.js";
import menuRouter from "./routes/menuRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// =====================
// PERFORMANCE BASICS
// =====================
app.disable("x-powered-by");
app.set("trust proxy", 1);

// =====================
// CONNECT SERVICES (ONCE)
// =====================
connectDB();
connectCloudinary();

// =====================
// PARSERS (FAST)
// =====================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// =====================
// CORS (RENDER SAFE)
// =====================
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",

  "https://www.ytmc.co.in",
  "https://ytmc.co.in",
  "https://ytmc-admin.vercel.app",

  process.env.CLIENT_ORIGIN,
  process.env.ADMIN_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true
  })
);

// =====================
// HEALTH CHECK (KEEP ALIVE)
// =====================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// =====================
// SOCKET.IO (FAST MODE)
// =====================
const server = http.createServer(app);

const io = new Server(server, {
  transports: ["websocket"], // 🔥 polling removed
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join_kitchen", () => {
    socket.join("kitchen");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// =====================
// ROUTES
// =====================
app.use("/api/reviews", reviewRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant-order", restaurantOrderRouter);
app.use("/api/menu", menuRouter);

// =====================
// ROOT
// =====================
app.get("/", (req, res) => {
  res.send("API Working – Ye Teri Meri Chai ☕");
});

// =====================
// START
// =====================
server.listen(PORT, () => {
  console.log(`🚀 Render server running on port ${PORT}`);
});
