const environments = {
  PORT: (process.env.PORT && parseInt(process.env.PORT, 10)) || 4000,
  MONGO_URL: process.env.MONGO_URL || "mongodb://mongo/ts-template",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default environments;
