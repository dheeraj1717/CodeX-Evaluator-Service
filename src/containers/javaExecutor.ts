import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import decodeDockerStream, { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";

class JavaExecutor implements CodeExecutorStrategy {
  async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    console.log("Initialising a new java docker container");
    await pullImage(JAVA_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\"`)}' | java Main`;
    console.log(runCommand);
    
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand
    ]);
    await javaDockerContainer.start();
    console.log("javaDockerContainer", javaDockerContainer);
    const loggerStream = await javaDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, // whether the logs are streammed or returned as a string
    });

    // attach events on the stream objects to start and stop reading
    loggerStream.on("data", (chunk) => rawLogBuffer.push(chunk));

    try {
      const codeResponse: string = await fetchDecodedStream(loggerStream, rawLogBuffer);
      if(codeResponse.trim() === outputTestCase.trim()){
        return {output: codeResponse, status: "SUCCESS"};
      } else {
        return {output: codeResponse, status: "WA"};
      }
    } catch (error) {
      if(error === "TLE"){
        await javaDockerContainer.kill();
        console.log("Container stopped", error);
        return {output: error as string, status: "TLE"};
      }
      return {output: error as string, status: "ERROR"};
    } finally {
      await javaDockerContainer.remove();
    }
  }
}

export default JavaExecutor;
