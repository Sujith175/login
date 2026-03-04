import UserModal from "../models/UserModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModal.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new UserModal({ name, email, mobile, password: hashed });
    await user.save();
    return res.status(201).json("user registered successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server Error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required " });
    }

    const exisingUser = await UserModal.findOne({ email });
    if (!exisingUser) {
      return res.status(400).json({ message: "User not exists" });
    }

    const isMatch = await bcrypt.compare(password, exisingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: exisingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "login Successfully", token });
  } catch {
    return res.status(500).json("Server Error");
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: Use findById and exclude the password field
    const user = await UserModal.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Details Error:", error.message);

    // If JWT verification fails, it's usually an auth error, not a server error
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      expires: new Date(0),
    });
    res.status(200).json({ message: "login Successfully", token });
  } catch (error) {
    return res.status(500).json("Server Error");
  }
};
