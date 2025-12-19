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
const port = process.env.PORT || 4000;
const LOCAL_URL = `http://localhost:${port}`;

// =====================
// CONNECT SERVICES (ONCE)
// =====================
connectDB();
connectCloudinary();

app.disable("x-powered-by");

// =====================
// PARSERS
// =====================
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================
// CORS CONFIG
// =====================
const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN,
  process.env.ADMIN_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ BLOCKED ORIGIN:", origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  })
);

// OPTIONS safe handler
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// =====================
// KEEP-ALIVE ROUTE (ANTI SLEEP)
// =====================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// =====================
// SOCKET.IO (FAST)
// =====================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"] // 🚀 NO POLLING
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
// ROOT TEST
// =====================
app.get("/", (req, res) => {
  res.send("API Working – Ye Teri Meri Chai ☕");
});

// =====================
// START
// =====================
server.listen(port, () => {
  console.log(`🚀 Server running on ${LOCAL_URL}`);
});

