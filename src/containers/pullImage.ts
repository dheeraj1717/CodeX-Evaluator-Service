import Docker from 'dockerode';

export default async function pullImage(imageName: string) {
    try {
        const docker = new Docker();
        const image = await docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
            if (err) {
                console.log(err);
            }
            docker.modem.followProgress(stream, (err: Error | null, res: any) => {
                if (err) {
                    console.log(err);
                }
                console.log(res);
            });
        });
        return image;
    } catch (error) {
        console.log(error);
    }
}