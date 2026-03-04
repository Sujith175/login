import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoute from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

import connectDB from "./config/DB.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(PORT, async () => {
  console.log(`App is running on http://localhost:${PORT}`);
  await connectDB();
});
