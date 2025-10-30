import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalAmount: { type: Number, required: true, default: 0 },
    totalExpense: { type: Number, required: true, default: 0 },
    totalIncome: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Tracker", trackerSchema);
