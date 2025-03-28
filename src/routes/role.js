import express from "express";
import RoleController from "../controllers/role";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/", [authenticate], RoleController.createRole);

export default router;
