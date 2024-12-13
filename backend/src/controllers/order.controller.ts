import { Request, Response } from "express"
import { orderService } from "../services/order.service"

export const createOrder = async (req: Request, res: Response, next: any) => {
  try {
    const orderId = await orderService.createOrder(req.body, req.userId!)
    res.status(201).json({ transactionId: orderId })
  } catch (error) {
    next(error)
  }
}

export const getOrderStatus = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const order = await orderService.getOrder({
      orderId: req.params.orderId,
      customerId: req.userId!,
    })
    res.status(200).json({
      order,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (req: Request, res: Response, next: any) => {
  try {
    const orders = await orderService.getOrders({ customerId: req.userId! })
    res.status(200).json({
      orders,
    })
  } catch (error) {
    next(error)
  }
}
