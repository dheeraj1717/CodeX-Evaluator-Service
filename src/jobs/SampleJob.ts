import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob {
  name: string;
  payload: Record<string, unknown>;
  constructor(payload: Record<string, unknown>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handler(job: Job): void {
    console.log("handler of the job called");
  }
  failed(job: Job, error: Error): void {
    console.log("job failed");
    if (job) {
      console.log(job.id);
    }
  }
}
