import express from "express";
import cors from "cors";
import helmet from "helmet"; // For securit against web attack

import versionRoutes from "./routes/versionRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(helmet());

app.use("/version", versionRoutes); // tudo que começa com /version vai pra esse setor
app.use("/auth", authRoutes);

export default app;