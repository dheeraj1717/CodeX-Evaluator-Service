import express from "express";
import { PORT } from "./config/serverConfig";
import apiRouter from "./routes";
import errorHandler from "./utils/errorHandler";
import runCPP from "./containers/runCPPDocker";
import SubmissionWorker from "./workers/submissionWorker";
import { SUBMISSION_QUEUE } from "./utils/constants";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Evaluator service is running on port ${PORT}`);

  SubmissionWorker(SUBMISSION_QUEUE);

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
