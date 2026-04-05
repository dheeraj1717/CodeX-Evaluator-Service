import express from "express";
import { PORT } from "./config/serverConfig";
import apiRouter from "./routes";
import errorHandler from "./utils/errorHandler";
import runCPP from "./containers/cppExecutor";
import SubmissionWorker from "./workers/submissionWorker";
import { SUBMISSION_QUEUE } from "./utils/constants";
import submissionQueueProducer from "./producers/submissionQueueProducer";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Evaluator service is running on port ${PORT}`);
  const userCode = `
  class Solution {
    public:
    vector<int> permute(){
    vector<int> v;
    v.push_back(10);
    return v;
    }
  };
  `;
  const code = `#include <iostream>
#include <vector>
using namespace std;
${userCode}
int main(){
Solution s;
vector<int> result = s.permute();
for(int i = 0; i < result.size(); i++){
  cout << result[i] << " ";
}
}
`;
  // const code = `
  // #include <iostream>
  // using namespace std;
  // int main() {
  //   int a, b;
  //   cin >> a >> b;
  //   cout << a + b << endl;
  //   return 0;
  // }
  // `;
  const inputCase = `10`;

  SubmissionWorker(SUBMISSION_QUEUE);
  // submissionQueueProducer({
  //   "1234": {
  //     language: "CPP",
  //     inputCase,
  //     code,
  //   },
  // });
});
