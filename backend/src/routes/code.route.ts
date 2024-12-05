import { Router } from "express"
import { getRedemptionCode, redeemCode } from "../controllers/code.controller"
import { validateData } from "../middleware/validationMiddleware"
import { redeemCodeSchema } from "../dtos/code"

const router = Router()

router.get("/:orderId", getRedemptionCode)
router.put("/redeem", validateData(redeemCodeSchema), redeemCode)

export default router
