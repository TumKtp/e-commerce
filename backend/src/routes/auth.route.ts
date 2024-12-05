import { Router } from "express"
import { login, register } from "../controllers/auth.controller"
import { validateData } from "../middleware/validationMiddleware"
import { loginSchema, registerSchema } from "../dtos/auth"

const router = Router()

router.post("/register", validateData(registerSchema), register)
router.post("/login", validateData(loginSchema), login)

export default router
