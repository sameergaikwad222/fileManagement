const { createLogger, format, transports, info } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = new createLogger({
  format: combine(label({ label: "myapp" }), timestamp(), myFormat),
  transports: [
    // new transports.File({
    //   filename: "combined.log",
    //   level: "info",
    // }),
    new transports.Console({
      level: "info",
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

module.exports = { logger };
