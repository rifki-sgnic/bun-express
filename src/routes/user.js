import express from "express";
import UserController from "../controllers/user";

const router = express.Router();

router.get("/", UserController.getUsers);
router.get("/id/:id", UserController.getUser);
router.get("/email/:email", UserController.getUserByEmail);
router.post("/", UserController.createUser);

export default router;
