import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/executorFactory";
import publishEvaluationResult from "../producers/evaluationQueueProducer";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handler = async (job: Job): Promise<void> => {
    console.log(this.payload);
    console.log("handler of the job called");
    if (job) {
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language.toUpperCase();
      const code = this.payload[key].code;
      const testCases = this.payload[key].testCases;
      
      const executor = createExecutor(codeLanguage);
      if (!executor) {
        throw new Error("Invalid language");
      }

      const testCaseResults = [];
      let overallStatus = "SUCCESS";

      for (const tc of testCases) {
        const response = await executor.execute(
          code,
          tc.input,
          tc.output,
        );
        testCaseResults.push({
          input: tc.input,
          output: response.output,
          expected: tc.output,
          status: response.status
        });
        if (response.status !== "SUCCESS" && overallStatus === "SUCCESS") {
          overallStatus = response.status;
        }
      }

      await publishEvaluationResult({
        testCaseResults,
        status: overallStatus,
        userId: this.payload[key].userId,
        submissionId: this.payload[key].submissionId,
      });
      if(overallStatus === "SUCCESS"){
        console.log("Batch code execution successful");
      } else {
        console.log("Batch code execution failed with status:", overallStatus);
      }
    }
  };
  failed(job: Job): void {
    console.log("job failed");
    if (job) {
      console.log(job.id);
    }
  }
}
