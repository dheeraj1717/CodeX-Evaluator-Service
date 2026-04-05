export type ExecutionResponse = {
    output: string;
    status: "SUCCESS" | "WA" | "ERROR" | "TLE";
}

interface CodeExecutorStrategy {
    execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse>;
}

export default CodeExecutorStrategy;