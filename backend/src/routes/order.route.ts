import { Router } from "express"
import {
  createOrder,
  getOrderStatus,
  getOrders,
} from "../controllers/order.controller"
import { validateData } from "../middleware/validationMiddleware"
import { createOrderSchema } from "../dtos/order"

const router = Router()

router.post("/", validateData(createOrderSchema), createOrder)
router.get("/", getOrders)
router.get("/:orderId", getOrderStatus)

export default router
