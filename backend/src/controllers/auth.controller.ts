import { Request, Response } from "express"
import { authService } from "../services/auth.service"

export const register = async (req: Request, res: Response, next: any) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: any) => {
  try {
    const user = await authService.login(req.body)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
