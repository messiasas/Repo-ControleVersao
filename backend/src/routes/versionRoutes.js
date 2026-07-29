import express from "express";
import * as controller from "../controllers/versionController.js";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

import { versionSchema, versionUpdateSchema } from "../validators/versionValidator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/chaves/distinct", controller.getDistinctChaves);
router.get("/plataformas/distinct", controller.getDistinctPlataformas);

/*o Express as trata como uma corrida em cadeia: chama a primeira, e só chama a segunda se a primeira invocar next(). 
Se uma delas responder (res.status(...).json(...)) sem chamar next(), a corrente para ali — as funções seguintes (incluindo o controller) nunca rodam.*/

router.post("/", authMiddleware, isAdmin, validate(versionSchema), controller.create);
router.put("/:id", authMiddleware, isAdmin, validate(versionUpdateSchema), controller.update);
router.delete("/:id", authMiddleware, isAdmin, controller.remove);

export default router;