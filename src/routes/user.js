import express from "express";
import UserController from "../controllers/user";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/", [authenticate], UserController.getUsers);
router.get("/id/:id", [authenticate], UserController.getUser);
router.get("/email/:email", [authenticate], UserController.getUserByEmail);
router.post("/", [authenticate], UserController.createUser);

export default router;
