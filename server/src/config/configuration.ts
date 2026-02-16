export default () => ({
  port: process.env.PORT || 3000,
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});
