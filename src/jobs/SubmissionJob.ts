import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import runCPP from "../containers/runCPPDocker";

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
     const key = Object.keys(this.payload)[0]
     if(this.payload[key].language === "CPP"){
     const response = await runCPP(this.payload[key].code,this.payload[key].inputCase)
     console.log("Evaluated response",response)
     }
    }
  }
  failed(job: Job): void {
    console.log("job failed");
    if (job) {
      console.log(job.id);
    }
  }
}
