export default () => ({
  port: process.env.PORT || 3000,
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
});
