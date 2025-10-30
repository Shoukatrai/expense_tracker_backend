import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoute from "./routes/incomeRoutes.js";
import expenseRoute from "./routes/expenseRoutes.js";
import trackerRoute from "./routes/tracker.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

try {
  await connectDB();
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed", err.messages);
}
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoute);
app.use("/api/v1/expense", expenseRoute);
app.use("/api/v1/tracker", trackerRoute);

console.log("after DB connection");
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`server running on http://localhost:${PORT}`)
  );
}

// Vercel deployment
export default app;