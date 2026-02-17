import Redis from 'ioredis';
import { REDIS_PORT, REDIS_HOST } from './serverConfig';

const redisConfig = {
    port: REDIS_PORT,
    host: REDIS_HOST,
}

const redisConnection = new Redis(redisConfig);
export default redisConnection;