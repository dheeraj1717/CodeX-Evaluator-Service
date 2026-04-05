import z from "zod";

export type CreateSubmissionDto = z.infer<typeof createSubmissionZodSchema>;

export const createSubmissionZodSchema = z.object({
  userId: z.string(),
  problemId: z.string(),
  code: z.string(),
  language: z.string(),
  inputCase: z.string(),
  outputCase: z.string(),
  submissionId: z.string(),
}).strict();
