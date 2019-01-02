const path = require("path");

const { createLogger, format, transports } = require('winston');

const myFormat = format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`);

const colors = {
  error: 'bold red',
  info: 'blue',
  debug: 'italic dim white'
};

const consoleLogger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "HH:mm:ss.SSS" }),
    format.cli({ colors }),
    myFormat,
  ),
  transports: [
    new transports.Console()
  ]
});

const fileDebugLogger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.padLevels(),
    myFormat,
  ),
  transports: [
    new transports.File({ filename: "debug.log" })
  ]
});

const logger = {
  debug(message) {
    fileDebugLogger.debug(message);
    consoleLogger.debug(message);
  },
  info(message) {
    fileDebugLogger.info(message);
    consoleLogger.info(message);
  },
  error(message) {
    fileDebugLogger.error(message);
    consoleLogger.error(message);
  }
}

// logger.error('Error message.');
// logger.info('Info message.');
// logger.debug('Debug message.');

module.exports = logger;