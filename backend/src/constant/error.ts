import { StatusCodes } from "http-status-codes"
import { LogLevel } from "./enum"
export class AppError extends Error {
  public statusCode: StatusCodes
  public logLevel: LogLevel

  constructor(
    message: string,
    statusCode: StatusCodes,
    logLevel = LogLevel.ERROR
  ) {
    super(message)
    this.statusCode = statusCode
    this.logLevel = logLevel
  }
}
