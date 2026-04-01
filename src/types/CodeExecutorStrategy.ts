export type ExecutionResponse = {
    output: string;
    status: string;
}

interface CodeExecutorStrategy {
    execute(code: string, inputTestCase: string): Promise<ExecutionResponse>;
}

export default CodeExecutorStrategy;