import express from "express";
import cors from "cors";
import helmet from "helmet"; // For securit against web attack

import versionRoutes from "./routes/versionRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
/*app.use(cors({
  origin: "http://localhost:3000"
}));*/
app.use(helmet());

app.use("/version", versionRoutes); // tudo que começa com /version vai pra esse setor

export default app;