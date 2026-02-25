import express from "express";
import { PORT } from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/SampleWorker";
import errorHandler from "./utils/errorHandler";
import runPython from "./containers/runPythonDocker";
import runJava from "./containers/runJavaDocker";
import runCPP from "./containers/runCPPDocker";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Evaluator service is running on port ${PORT}`);

  SampleWorker("SampleQueue");

  const code = `
  #include <iostream>
  using namespace std;
  int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
  }
  `;
  runCPP(code, "10 20");
});
