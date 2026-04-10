import express from "express";
import * as controller from "../controllers/versionController.js";

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", controller.create);

export default router;