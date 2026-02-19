import { Ilog } from "../types/logDefinition";

const winston = require("winston");
require("winston-mongodb");

const allowedTransports = [];
allowedTransports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.printf((log: Ilog) => {
        return `${log.timestamp} [${log.level}]: ${log.message} ${log.label ? `[${log.label}]:` : ""} ${log.source ? `[${log.source}]` : ""}`;
      }),
    ),
  }),
);

allowedTransports.push(
  new winston.transports.MongoDB({
    level: "error",
    db: process.env.LOG_DB_URI,
    collection: "logs",
    capped: true,
    cappedSize: 52428800, // 50MB limit
    cappedMax: 50000,    // 50,000 logs limit
  }),
);

allowedTransports.push(
  new winston.transports.File({
    level: "error",
    filename: `${__dirname}/../logs/error.log`,
  }),
);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf((log: Ilog) => {
      return `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message} ${log.label ? `[${log.label}]` : ""} ${log.source ? `[${log.source}]` : ""}`;
    }),
  ),
  defaultMeta: { service: "problem-service" },
  transports: allowedTransports,
});

module.exports = logger;
