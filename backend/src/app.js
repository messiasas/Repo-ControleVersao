import express from "express";
import cors from "cors";
import helmet from "helmet"; // For securit against web attack

const app = express();

app.use(express.json());
app.use(cors()); // verify securit, this model is to any origin
/*app.use(cors({
  origin: "http://localhost:3000"
}));*/
app.use(helmet());

export default app;