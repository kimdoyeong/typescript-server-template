const environments = {
  PORT: (process.env.PORT && parseInt(process.env.PORT, 10)) || 4000,
};

export default environments;
