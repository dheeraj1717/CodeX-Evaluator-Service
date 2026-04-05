import Dockerode from "dockerode";
import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
  let offset = 0; // this variable will be used to keep track of the current position in the buffer while parsing

  // the output that will store the stdout and stderr output as string
  const output: DockerStreamOutput = {
    stdout: "",
    stderr: "",
  };

  //loop until the offset reaches the end of the buffer
  while (offset < buffer.length) {
    // typeOfStream is read from buffer and has value of type of stream
    const typeOfStream = buffer[offset];

    // this length variable hold the length of the value of the chunk
    // we will read this variable on an offset of 4 bytes from the current offset
    const length = buffer.readUInt32BE(offset + 4);

    // so now we have read the header, we can move forward and read the value of the chunk
    offset += DOCKER_STREAM_HEADER_SIZE;

    if (typeOfStream === 1) {
      //stdout stream
      output.stdout += buffer.toString("utf-8", offset, offset + length);
    } else if (typeOfStream === 2) {
      //stderr stream
      output.stderr += buffer.toString("utf-8", offset, offset + length);
    }

    offset += length;
  }

  return output;
}

export function fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {
  return new Promise((res, rej) => {
  const timeout = setTimeout(() => {
    console.log("Container timed out");
    rej("TLE");
  }, 5000);
          loggerStream.on("end", () => {
            clearTimeout(timeout);
            console.log("rawLogBuffer", rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedOutput = decodeDockerStream(completeBuffer);
            console.log("decodedOutput", decodedOutput);
            if (decodedOutput.stderr) {
              rej(decodedOutput.stderr);
            }
            res(decodedOutput.stdout);
          });
        });
      }
