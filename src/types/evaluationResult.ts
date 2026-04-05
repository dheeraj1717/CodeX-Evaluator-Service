export type EvaluationResult = {
  submissionId: string;
  userId: string;
  output: string;
  status: "SUCCESS" | "WA" | "ERROR" | "TLE";
};