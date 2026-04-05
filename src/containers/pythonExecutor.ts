import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";

class PythonExecutor implements CodeExecutorStrategy {
  async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    await pullImage(PYTHON_IMAGE);
    console.log("Initialising a new python docker container");
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);
    await pythonDockerContainer.start();
    console.log("pythonDockerContainer", pythonDockerContainer);
    const loggerStream = await pythonDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, // whether the logs are streammed or returned as a string
    });

    // attach events on the stream objects to start and stop reading
    loggerStream.on("data", (chunk) => rawLogBuffer.push(chunk));

    try {
      const codeResponse: string = await fetchDecodedStream(loggerStream, rawLogBuffer);
      return {output: codeResponse, status: "SUCCESS"};
    } catch (error) {
      return {output: error as string, status: "ERROR"};
    } finally {
      await pythonDockerContainer.remove();
    }
  }
}

export default PythonExecutor;
