import { Request, Response, NextFunction } from "express"
import { z, ZodError } from "zod"

import { StatusCodes } from "http-status-codes"
import { AppError } from "../constant/error"
import logger from "../config/logging"
import { LogLevel } from "../constant/enum"

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(
          (issue: any) => `${issue.path.join(".")} is ${issue.message}`
        )
        const readableErrorMessage = errorMessages.join(", ")
        logger.warn(readableErrorMessage)
        throw new AppError(
          readableErrorMessage,
          StatusCodes.BAD_REQUEST,
          LogLevel.WARN
        )
      } else {
        logger.error(error)
        throw new AppError("Validation failed", StatusCodes.BAD_REQUEST)
      }
    }
  }
}
