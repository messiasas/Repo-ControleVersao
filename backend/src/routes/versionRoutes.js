import express from "express";
import * as controller from "../controllers/versionController.js";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

import { versionSchema } from "../validators/versionValidator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", controller.getAll); // authMiddleware
router.post("/", validate(versionSchema), authMiddleware, isAdmin, controller.create);

export default router;