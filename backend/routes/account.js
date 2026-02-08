import express from "express";
import mongoose from "mongoose";

import { authMiddleware } from "../middleware.js";
import { Account } from "../db.js";

const router = express.Router();

/* ================= BALANCE ================= */

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

/* ================= TRANSFER ================= */

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { amount, to } = req.body;

    const fromAccount = await Account.findOne({
      userId: req.userId,
    }).session(session);

    if (!fromAccount || fromAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient funds",
      });
    }

    const toAccount = await Account.findOne({
      userId: to,
    }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid receiver",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } },
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } },
    ).session(session);

    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Transfer failed",
    });
  } finally {
    session.endSession();
  }
});

export default router;
