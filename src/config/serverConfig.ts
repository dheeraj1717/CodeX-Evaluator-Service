process.loadEnvFile();

export const PORT = process.env.PORT || 4001;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
export const REDIS_HOST = process.env.REDIS_HOST || "[IP_ADDRESS]";
