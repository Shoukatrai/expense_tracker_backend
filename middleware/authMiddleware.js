import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    if (!token) return res.status(401).json({ message: "User not logged in!" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const { id } = decoded;
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Not Logged in!", error: error.message });
  }
};
