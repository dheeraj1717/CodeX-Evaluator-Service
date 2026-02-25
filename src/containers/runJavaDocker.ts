import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log("Initialising a new java docker container");
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
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

  await new Promise((res) => {
    loggerStream.on("end", () => {
      console.log("rawLogBuffer", rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedOutput = decodeDockerStream(completeBuffer);
      console.log("decodedOutput", decodedOutput);
      res(decodedOutput);
    });
  });
  await javaDockerContainer.remove();
}

export default runJava;
