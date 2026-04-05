"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverConfig_1 = require("./config/serverConfig");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const submissionWorker_1 = __importDefault(require("./workers/submissionWorker"));
const constants_1 = require("./utils/constants");
const submissionQueueProducer_1 = __importDefault(require("./producers/submissionQueueProducer"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.default);
app.use(errorHandler_1.default);
app.listen(serverConfig_1.PORT, () => {
    console.log(`Evaluator service is running on port ${serverConfig_1.PORT}`);
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
    (0, submissionWorker_1.default)(constants_1.SUBMISSION_QUEUE);
    (0, submissionQueueProducer_1.default)({
        "1234": {
            language: "CPP",
            inputCase,
            code,
        },
    });
});
