import Tracker from "../models/Tracker.js";

export const getTrckerValues = async (req, res) => {
  try {
    console.log("hit");
    const tracker = await Tracker.find({ userId: req.user });
    res.status(200).json({
      data: tracker,
      staus: true,
      message: "Tracker values fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      data: null,
      staus: false,
      message: "Tracker values fetched error",
      error: error.message,
    });
  }
};
