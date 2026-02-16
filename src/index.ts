import express from "express";
import { PORT } from "./config/serverConfig";
import apiRouter from "./routes";

const app = express();

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Evaluator service is running on port ${PORT}`);
});
