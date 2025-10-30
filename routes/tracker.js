import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getTrckerValues } from "../controllers/tracker.js";
const router = express.Router();

router.get("/get", protect, getTrckerValues);

export default router;
