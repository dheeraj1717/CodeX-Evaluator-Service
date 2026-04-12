export type SubmissionPayload = {
    submissionId: string;
    language: string;
    code: string;
    testCases: { input: string; output: string }[];
    userId: string;
}