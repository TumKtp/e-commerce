import { createLogger, format, transports } from "winston"
const { combine, timestamp, json, colorize } = format

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })
)

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
  ],
})

export default logger
