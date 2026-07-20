import express from "express";
import cors from "cors";
import helmet from "helmet"; // For securit against web attack

import versionRoutes from "./routes/versionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json()); 
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(helmet()); 

app.use("/versions", versionRoutes); 
app.use("/auth", authRoutes); // único endpoint, faz login e presumivelmente devolve um token/sessão.
app.use("/logs", logRoutes);
app.use("/users", userRoutes);

export default app;