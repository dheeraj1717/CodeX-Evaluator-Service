import { Ilog } from "../types/logDefinition";

import winston from "winston";
import "winston-mongodb";
import { LOG_DB_URI } from "./serverConfig";

const allowedTransports = [];
allowedTransports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.printf((info) => {
        const log = info as unknown as Ilog;
        return `${log.timestamp} [${log.level}]: ${log.message} ${log.label ? `[${log.label}]:` : ""} ${log.source ? `[${log.source}]` : ""}`;
      }),
    ),
  }),
);

allowedTransports.push(
  new winston.transports.MongoDB({
    level: "error",
    db: LOG_DB_URI,
    collection: "logs",
    capped: true,
    cappedSize: 52428800, // 50MB limit
    cappedMax: 50000, // 50,000 logs limit
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
    winston.format.printf((info) => {
      const log = info as unknown as Ilog;
      return `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message} ${log.label ? `[${log.label}]` : ""} ${log.source ? `[${log.source}]` : ""}`;
    }),
  ),
  defaultMeta: { service: "problem-service" },
  transports: allowedTransports,
});

export default logger;
