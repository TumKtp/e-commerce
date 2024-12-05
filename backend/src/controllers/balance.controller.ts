import { Request, Response } from "express"
import { balanceService } from "../services/balance.service"

export const getBalance = async (req: Request, res: Response, next: any) => {
  try {
    const balance = await balanceService.getBalance(req.userId!)
    res.status(200).json({ balance })
  } catch (error) {
    next(error)
  }
}
