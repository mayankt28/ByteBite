import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis', // container name in docker-compose
  port: 6379
});

export default redis;
