import redisClient from "../config/redis.js";
import Income from "../models/Income.js";
import Tracker from "../models/Tracker.js";
import * as xlsx from "xlsx";
export const addIncome = async (req, res) => {
  try {
    const userId = req.user;
    const { source, amount, date } = req.body;
    if (!source || !amount || !date)
      return res.status(400).json({ message: "All fields are required" });
    const income = await Income.create({
      userId,
      source,
      amount,
      date: new Date(date),
    });
    let tracker = await Tracker.findOne({ userId });
    if (!tracker) {
      await Tracker.create({
        userId,
        totalAmount: 0 + Number(amount),
        totalExpense: 0,
        totalIncome: 0 + Number(amount),
      });
      // const key = "/api/v1/income/get"
      // await redisClient.del(key);
      return res.status(201).json({
        message: "Income Added Successfully!",
        status: true,
        data: income,
      });
    }
    tracker.totalIncome = tracker.totalIncome + Number(amount);
    tracker.totalAmount = tracker.totalAmount + Number(amount);
    tracker.save();
    res.status(200).json({
      message: "Income Added Successfully!",
      status: true,
      data: income,
    });
  } catch (error) {
    res.status(200).json({
      message: "Server error",
      status: false,
      data: null,
      error: error.message,
    });
  }
};
export const getAllIncome = async (req, res) => {
  try {
    const userId = req.user;
    const income = await Income.find({ userId: userId }).sort({ date: -1 });
    console.log("Income", income);
    // redisClient.setEx(req.originalUrl , 600, JSON.stringify(income));
    res.status(200).json({
      message: "Income GOT Successfully!",
      data: income,
      status: true,
    });
  } catch (error) {
    res.status(200).json({
      message: "Income fetching error!",
      data: null,
      status: false,
    });
  }
};
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    // const key = "/api/v1/income/get"
    //   await redisClient.del(key);
    res.status(200).json({
      message: "Income Deleted Successfully!",
      data: null,
      status: true,
    });
  } catch (error) {
    res.status(200).json({
      message: "Income deleting error!",
      data: null,
      status: false,
    });
  }
};
export const downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user;
    console.log("id", userId);
    const incomes = await Income.find({ userId: userId }).sort({ date: -1 });
    const tracker = await Tracker.find({ userId: userId });
    console.log("tracker", tracker);
    console.log("incomes", incomes);
    const data = incomes.map((item) => ({
      source: item.source,
      amount: item.amount,
      date: item.date.toLocaleDateString(),
    }));

    const sheetData = xlsx.utils.json_to_sheet(data);
    const book = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(book, sheetData, "Income");
    const sheet = xlsx.write(book, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income-report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).send(sheet);
  } catch (error) {
    res.status(200).json({
      message: "Income Downloading Error!",
      sheet: null,
      status: false,
    });
  }
};

export const getAllIncomeByDate = async (req, res) => {
  try {
    const date = req.params.date;
    console.log("date", date);
    const userId = req.user;
    const income = await Income.find({ userId: userId, date: date }).sort({
      date: -1,
    });
    console.log("income", income);
    res.status(200).json({
      message: "income GOT Successfully!",
      data: income,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "income fetching error!",
      data: null,
      status: false,
    });
  }
};
