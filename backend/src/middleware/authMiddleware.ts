import { Request, Response, NextFunction } from "express"
import jwt, { Jwt, JwtPayload } from "jsonwebtoken"
import logger from "../config/logging"
import { AppError } from "../constant/error"
import { StatusCodes } from "http-status-codes"

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Missing token", StatusCodes.UNAUTHORIZED)
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.userId = (decoded as { id: string }).id
    next()
  } catch (error) {
    throw new AppError("Unauthorized: Invalid token", StatusCodes.UNAUTHORIZED)
  }
}
