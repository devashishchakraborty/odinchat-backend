import express from "express";
import path from "path";
import routes from "./routes/index.js";
import cors from "cors";
import authenticateJWT from "./middlewares/authenticateToken.js";
import { Server } from "socket.io";
import { createServer } from "http";
import configureSocket from "./config/socket.js";
import "dotenv/config";


const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST"],
  },
});

configureSocket(io);
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
