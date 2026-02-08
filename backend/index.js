import express from "express";
import cors from "cors";

import rootRouter from "./routes/index.js";
import { connectDB } from "./db.js";

const app = express();

/* ====== MIDDLEWARE ====== */
app.use(cors());
app.use(express.json());

/* ====== ROUTES ====== */
app.use("/api/v1", rootRouter);

/* ====== DB + SERVER ====== */
connectDB();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
