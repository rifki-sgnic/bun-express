import express from "express";
import AuthcController from "../controllers/auth";

const router = express.Router();

router.post("/register", AuthcController.register);
router.post("/login", AuthcController.login);
router.post("/refresh", AuthcController.refresh);
router.get("/logout", AuthcController.logout);

export default router;
