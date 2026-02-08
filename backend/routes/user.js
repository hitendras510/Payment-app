import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";

import { User, Account } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

const UserRouter = express.Router();

/* ================== ZOD SCHEMAS ================== */

const signupBody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string().min(6),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});

const updateBody = zod.object({
  username: zod.string().email().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().min(6).optional(),
});

/* ================== ROUTES ================== */

UserRouter.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
  });

  await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 100,
  });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.status(201).json({
    message: "User created successfully",
    token,
  });
});

UserRouter.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({
    message: "User signed in successfully",
    token,
  });
});

UserRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully!",
  });
});

UserRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      { firstName: { $regex: filter, $options: "i" } },
      { lastName: { $regex: filter, $options: "i" } },
    ],
  });

  res.json({
    users: users.map((user) => ({
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      _id: user._id,
    })),
  });
});

export default UserRouter;
