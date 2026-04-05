import Docker from 'dockerode';

async function createContainer(imageName: string, cmdExecutable: string[]) {
    const docker = new Docker();
    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true, // to enable input streams
        AttachStdout: true, // to enable ouput streams
        AttachStderr: true, // to enable error streams
        Tty: false, // to disable pseudo-TTY
        OpenStdin: true, // to keep the input stream opne even no interaction is there
        StdinOnce: true, // to close stdin after the first read
        HostConfig: {
            Memory: 1024 * 1024 * 256, // 256MB
            CpuShares: 512, // 50% of CPU
        }
    });
    return container;
}

export default createContainer;