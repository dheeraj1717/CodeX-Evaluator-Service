import Docker from 'dockerode';

export default async function pullImage(imageName: string): Promise<void> {
    try {
        const docker = new Docker();
        return new Promise((resolve, reject) => {
            docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                docker.modem.followProgress(stream, (err: Error | null, res: any) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    console.log(`Successfully pulled image: ${imageName}`);
                    resolve();
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}