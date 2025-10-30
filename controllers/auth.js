import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10h" });
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, profileImageUrl } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email: email });
    console.log("existingUser", existingUser);
    if (existingUser) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Email already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl,
    });
    res.status(201).json({
      status: true,
      data: user,
      message: "User created successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: null,
      message: "User creating error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email: email });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "User Not Found!",
      });
    }
    const comparePassword = await bcrypt.compare(password, user?.password);
    if (!comparePassword) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Email or password is incorrect!",
      });
    }
    res.status(200).json({
      status: false,
      data: user,
      message: "Login successfully!",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      data: null,
      message: "Login error!",
      error: error.message,
    });
  }
};
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    console.log("user", user);
    if (!user) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "User Not Found!",
      });
    }
    res.status(200).json({
      status: true,
      data: user,
      message: "User found successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: null,
      message: "User not found!",
      error: error.message,
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const userId = req.user;
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file Uploaded",
        data: null,
      });
    }
    const fileBuffer = req.file.buffer;
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "expense_trecker" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(fileBuffer);
    });

    console.log("response", response);
    const user = await User.findById(req.user);
    console.log("user 150" , user);
    user.profileImageUrl = response.secure_url;
    user.save();
    res.status(200).json({
      iamgeUrl: response.secure_url,
      status: true,
      message: "Image uploaded successfully!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: false,
      data: null,
      message: "Image uploadeding error!",
      error: error,
    });
  }
};
