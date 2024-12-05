import { Router } from "express"
import {
  getProducts,
  createProduct,
  createProductType,
  getProductTypes,
} from "../controllers/product.controller"
import { validateData } from "../middleware/validationMiddleware"
import { createProductSchema, createProductTypeSchema } from "../dtos/product"
const router = Router()

router.post("/", validateData(createProductSchema), createProduct)
router.get("/", getProducts)
router.post(
  "/:productId/types",
  validateData(createProductTypeSchema),
  createProductType
)
router.get("/:productId/types", getProductTypes)

export default router
