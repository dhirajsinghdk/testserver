import express from "express";
import { userController } from "./user.controller";
import authmiddleware from "../../middleware/authmiddleware";

const router = express.Router();

router.post("/user", userController.create);
router.get("/user", authmiddleware.authenticate, userController.getAll);
router.get("/user/:id", authmiddleware.authenticate, userController.getById);
router.patch("/user/:id", authmiddleware.authenticate, userController.update);
router.delete("/user/:id", authmiddleware.authenticate, userController.delete);
router.post("/login", userController.login);

export default router;