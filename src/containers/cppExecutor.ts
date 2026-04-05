import createContainer from "./containerFactory";
import { CPP_IMAGE } from "../utils/constants";
import decodeDockerStream, { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, {
  ExecutionResponse,
} from "../types/CodeExecutorStrategy";

class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
  ): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    console.log("Initialising a new cpp docker container");
    await pullImage(CPP_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.cpp && g++ Main.cpp -o Main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./Main`;
    console.log(runCommand);

    const cppDockerContainer = await createContainer(CPP_IMAGE, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);
    console.log("cppDockerContainer", cppDockerContainer);
    const loggerStream = await cppDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, // whether the logs are streammed or returned as a string
    });

    // attach events on the stream objects to start and stop reading
    loggerStream.on("data", (chunk) => rawLogBuffer.push(chunk));

    try {
      const codeResponse: string = await fetchDecodedStream(
        loggerStream,
        rawLogBuffer
      );
      return { output: codeResponse, status: "SUCCESS" };
    } catch (error) {
      return { output: error as string, status: "ERROR" };
    } finally {
      await cppDockerContainer.remove();
    }
  }
}

export default CppExecutor;
