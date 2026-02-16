import express from "express";
import { PORT } from "./config/serverConfig";

const app = express();

app.listen(PORT, () => {
  console.log(`Evaluator service is running on port ${PORT}`);
});
