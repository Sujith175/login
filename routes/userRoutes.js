import express from "express";
import {
  getUserDetails,
  loginUser,
  logout,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUserdetails", getUserDetails);
router.post("/logout", logout);
export default router;
