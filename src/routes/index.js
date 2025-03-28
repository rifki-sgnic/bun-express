import express from "express";
import authRoutes from "./auth";
import roleRoutes from "./role";
import userRoutes from "./user";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/users", userRoutes);

export default router;
