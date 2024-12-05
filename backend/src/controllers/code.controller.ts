import { Request, Response } from "express"
import { codeService } from "../services/code.service"

export const getRedemptionCode = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const codes = await codeService.getRedemptionCode({
      customerId: req.userId!,
      orderId: req.params.orderId,
    })
    res.status(200).json({ codes })
  } catch (error) {
    next(error)
  }
}

export const redeemCode = async (req: Request, res: Response, next: any) => {
  try {
    const status = await codeService.redeemCode({
      code: req.body.code,
    })
    res.status(200).json({ status })
  } catch (error) {
    next(error)
  }
}
