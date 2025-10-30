import Expense from "../models/expense.js";
import Tracker from "../models/Tracker.js";
import xlsx from "xlsx";
export const addExpense = async (req, res) => {
  try {
    const userId = req.user;
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      amount: Number(amount),
      category,
      description,
      date,
      userId,
    });

    let tracker = await Tracker.findOne({ userId });

    if (!tracker) {
      tracker = await Tracker.create({
        userId,
        totalAmount: 0 - Number(amount),
        totalExpense: Number(amount),
        totalIncome: 0,
      });
      return res.status(201).json({
        message: "Expense Added Successfully!",
        status: true,
        data: expense,
      });
    } else {
      tracker.totalExpense = Number(tracker.totalExpense) + Number(amount);
      tracker.totalAmount = Number(tracker.totalAmount) - Number(amount);
      await tracker.save();
    }

    console.log(" Expense added:", expense);
    console.log("Tracker updated:", tracker);

    return res.status(200).json({
      message: "Expense added successfully!",
      status: true,
      data: expense,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    return res.status(500).json({
      message: "Server error",
      status: false,
      error: error.message,
    });
  }
};

export const getAllExpense = async (req, res) => {
  try {
    const userId = req.user;
    const expense = await Expense.find({ userId: userId }).sort({ date: -1 });
    console.log("expense", expense);
    res.status(200).json({
      message: "Expense GOT Successfully!",
      data: expense,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Expense fetching error!",
      data: null,
      status: false,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const expense = await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Expense Deleted Successfully!",
      data: null,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Expense deleting error!",
      data: null,
      status: false,
    });
  }
};

export const downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user;
    console.log("id", userId);
    const expenses = await Expense.find({ userId: userId }).sort({ date: -1 });
    console.log("expenses", expenses);
    const data = expenses.map((item) => ({
      amount: item.amount,
      category: item.category,
      description: item.description,
      date: item.date.toLocaleDateString(),
    }));

    const sheetData = xlsx.utils.json_to_sheet(data);
    const book = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(book, sheetData, "Expense");
    const sheet = xlsx.write(book, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense-report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).send(sheet);
  } catch (error) {
    res.status(200).json({
      message: "Expense Downloading Error!",
      sheet: null,
      status: false,
    });
  }
};

export const getAllExpenseByDate = async (req, res) => {
  try {
    const date = req.params.date;
    console.log("date", date);
    const userId = req.user;
    const expense = await Expense.find({ userId: userId, date: date }).sort({
      date: -1,
    });
    console.log("expense", expense);
    res.status(200).json({
      message: "Expense GOT Successfully!",
      data: expense,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Expense fetching error!",
      data: null,
      status: false,
    });
  }
};
