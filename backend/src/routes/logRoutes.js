import express from "express";
import * as controller from "../controllers/logController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, isAdmin, controller.getPackagesWithHistory);
router.get("/:id", authMiddleware, isAdmin, controller.getVersionHistory);

export default router;
