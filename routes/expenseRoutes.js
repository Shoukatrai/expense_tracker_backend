import express from "express";
import {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  getAllExpenseByDate,
} from "../controllers/expense.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.get("/:date", protect, getAllExpenseByDate);
router.delete("/:id", protect, deleteExpense);

export default router;
