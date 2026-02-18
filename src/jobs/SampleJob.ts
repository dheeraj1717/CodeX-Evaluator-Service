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
    console.log(this.payload);
    console.log("handler of the job called");
    if (job) {
      console.log(job.name, job.id, job.data);
    }
  }
  failed(job: Job): void {
    console.log("job failed");
    if (job) {
      console.log(job.id);
    }
  }
}
