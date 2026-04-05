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
      const inputTestCase = this.payload[key].inputCase;
      const outputTestCase = this.payload[key].outputCase;
      const executor = createExecutor(codeLanguage);
      if (!executor) {
        throw new Error("Invalid language");
      }
      const response = await executor.execute(
        code,
        inputTestCase,
        outputTestCase,
      );
      await publishEvaluationResult({
        ...response,
        userId: this.payload[key].userId,
        submissionId: this.payload[key].submissionId,
      });
      if(response.status === "SUCCESS"){
        console.log("Code executed successfully", response);
      } else {
        console.log("Code execution failed", response);
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
