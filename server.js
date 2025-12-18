import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import reviewRouter from "./routes/reviewRoute.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import restaurantOrderRouter from "./routes/restaurantOrderRoute.js";
import menuRouter from "./routes/menuRoute.js";

import http from "http";
import { Server } from "socket.io";

console.log("JWT SECRET:", process.env.JWT_SECRET);


const app = express();
const port = process.env.PORT || 4000;
const LOCAL_URL = `http://localhost:${port}`;



// CONNECT DATABASE + CLOUDINARY

connectDB();
connectCloudinary();




// PARSERS

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/reviews", reviewRouter);



// GLOBAL ALLOWED ORIGINS

const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN,  // frontend
  process.env.ADMIN_ORIGIN,   // admin panel
  "http://localhost:5173",    // fallback frontend
  "http://localhost:5174"     // fallback admin
];

console.log("DEBUG CLIENT_ORIGIN =", process.env.CLIENT_ORIGIN);
console.log("DEBUG ADMIN_ORIGIN  =", process.env.ADMIN_ORIGIN);
console.log("DEBUG ALLOWED_ORIGINS =", ALLOWED_ORIGINS);



// CORS MIDDLEWARE (EXPRESS 5 SAFE)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED ORIGIN:", origin);
      return callback(new Error("CORS Blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  })
);




// SOCKET.IO SERVER

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Attach io to app for use in controllers
app.set("io", io);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_kitchen", () => {
    socket.join("kitchen");
    console.log(`Kitchen joined: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});



// ROUTES

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant-order", restaurantOrderRouter);
app.use("/api/menu", menuRouter);



// TEST ROUTE

app.get("/", (req, res) => {
  res.send(`
    <h2>API Working (Ye teri meri chai) 😍</h2>
    <p>Local Server Running At: <strong>${LOCAL_URL}</strong></p>
  `);
});


// START SERVER

server.listen(port, () => {
  console.log(`🚀 Laala Hogya Start on port: ${port}`);
  console.log(`LOCAL URL: ${LOCAL_URL}`);
});
