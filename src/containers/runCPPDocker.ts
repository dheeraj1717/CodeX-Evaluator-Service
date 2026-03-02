import createContainer from "./containerFactory";
import { CPP_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runCPP(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log("Initialising a new cpp docker container");
  await pullImage(CPP_IMAGE);
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.cpp && g++ Main.cpp -o Main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./Main`;
  console.log(runCommand);

  const cppDockerContainer = await createContainer(CPP_IMAGE, [
    '/bin/sh',
    '-c',
    runCommand
  ]);
  await cppDockerContainer.start();
  console.log("cppDockerContainer", cppDockerContainer);
  const loggerStream = await cppDockerContainer.logs({
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
  await cppDockerContainer.remove();
}

export default runCPP;
