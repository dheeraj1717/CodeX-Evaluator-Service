import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/executorFactory";

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
      const executor = createExecutor(codeLanguage);
      if(!executor){
        throw new Error("Invalid language");
      }
      const response = await executor.execute(
        this.payload[key].code,
        this.payload[key].inputCase,
      );
      if(response.status === "ERROR"){
        throw new Error(response.output);
      }
      if(response.status === "COMPLETED"){
        console.log("Code executed successfully");
        console.log(response.output);
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