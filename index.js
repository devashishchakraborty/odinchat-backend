import express from "express";
import path from "path";
import routes from "./routes/index.js";
import cors from "cors";
import authenticateJWT from "./middlewares/authenticateToken.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(cors());

app.use(routes.authRouter);
app.use("/api/users", authenticateJWT, routes.userRouter);
app.use("/api/messages", authenticateJWT, routes.messageRouter);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Blog API listening on port ${port}`);
});
