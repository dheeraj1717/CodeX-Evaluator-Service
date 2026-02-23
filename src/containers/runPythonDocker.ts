import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log("Initialising a new python docker container");
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
  console.log(runCommand);
  // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']); 
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    '/bin/sh',
    '-c',
    runCommand
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

  await new Promise((res) => {
    loggerStream.on("end", () => {
      console.log("rawLogBuffer", rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedOutput = decodeDockerStream(completeBuffer);
      console.log("decodedOutput", decodedOutput);
      res(decodedOutput);
    });
  });
  await pythonDockerContainer.remove();
}

export default runPython;
