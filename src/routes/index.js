import express from "express";
import authRoutes from "./auth";
import userRoutes from "./user";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
