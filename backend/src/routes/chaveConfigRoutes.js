import express from "express";
import * as controller from "../controllers/chaveConfigController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { chaveConfigSchema, chaveConfigUpdateSchema } from "../validators/chaveConfigValidator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/logs", authMiddleware, isAdmin, controller.getLogs);
router.post("/", authMiddleware, isAdmin, validate(chaveConfigSchema), controller.create);
router.put("/:id", authMiddleware, isAdmin, validate(chaveConfigUpdateSchema), controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.remove);

export default router;
