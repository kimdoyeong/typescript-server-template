import chalk from "chalk";
import winston from "winston";

const Logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default Logger;
