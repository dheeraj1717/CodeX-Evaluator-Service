import evaluationQueue from "../queues/EvaluationQueue";
import { EvaluationResult } from "../types/evaluationResult";

export default async function (payload: EvaluationResult) {
  await evaluationQueue.add("EvaluationJob", payload);
  console.log("Successfully added a new job to the evaluation queue");
}