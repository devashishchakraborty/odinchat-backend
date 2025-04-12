import express from "express";
import path from "path";
import routes from "./routes/index.js";
import cors from "cors";
import authenticateJWT from "./middlewares/authenticateToken.js";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: token invalid"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.id);

  // Join a room (e.g., private chat between two users)
  socket.on("join room", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
  });

  socket.on("send message", async (data) => {
    console.log(`User ${socket.user.id} sent:`, data.text);
    const { text, authorId, receiverId } = data;
    const roomId = [authorId, receiverId].sort().join("-");

    const message = await prisma.message.create({
      data: {
        text,
        author_id: authorId,
        receiver_id: receiverId,
      },
    });

    io.to(roomId).emit("receive message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected: " + socket.user.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(cors());

app.use(routes.authRouter);
app.use("/api/users", authenticateJWT, routes.userRouter);
app.use("/api/messages", authenticateJWT, routes.messageRouter);
app.use("/api/profile", authenticateJWT, routes.profileRouter);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

server.listen(port, () => {
  console.log(`Blog API listening on port ${port}`);
});
