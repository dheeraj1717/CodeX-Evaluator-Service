export type EvaluationResult = {
  submissionId: string;
  userId: string;
  output?: string;
  status: string;
  testCaseResults?: {
     input: string;
     output: string;
     expected: string;
     status: string;
     error?: string;
  }[];
};