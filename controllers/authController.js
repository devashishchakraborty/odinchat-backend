import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";

const prisma = new PrismaClient();
const validateSignUp = [
  body("email")
    .toLowerCase()
    .trim()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (user) {
        throw new Error("Email already exists! Try a different one.");
      }
    }),
    body("name")
    .trim()
];

const userSignUp = [
  validateSignUp,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).send({ errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: { ...req.body, password: hashedPassword },
    });
    res.sendStatus(200);
  }),
];

const userLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return res.status(400).send({ err });
    if (!user) {
      return res.status(400).send({ err: info.message });
    }
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return res.send({ token });
  })(req, res, next);
};

export default {
  userLogin,
  userSignUp,
};
