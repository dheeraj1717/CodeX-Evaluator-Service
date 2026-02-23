import express from "express";
import { PORT } from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/SampleWorker";
import errorHandler from "./utils/errorHandler";
import runPython from "./containers/runPythonDocker";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Evaluator service is running on port ${PORT}`);

  SampleWorker("SampleQueue");

  const code = "print('Hello World')";
  runPython(code, "");
});
