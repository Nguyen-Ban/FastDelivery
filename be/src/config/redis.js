const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''; // lấy từ biến môi trường

const redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD, // thêm dòng này
});

redisClient.on('connect', () => console.log('Connected to Redis successfully.'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redisClient;
