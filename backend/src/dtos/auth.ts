import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>