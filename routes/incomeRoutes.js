import express from "express";
import {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
  getAllIncomeByDate,
} from "../controllers/Income.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);
router.get("/:date", protect, getAllIncomeByDate);
router.delete("/:id", protect, deleteIncome);

export default router;
