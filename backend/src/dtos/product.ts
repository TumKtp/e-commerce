import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
})
export const createProductTypeSchema = z.object({
  price: z.number().positive(),
  type: z.string(),
  quantity: z.number().positive(),
})

export type CreateProductDTO = z.infer<typeof createProductSchema>
export type CreateProductTypeDTO = z.infer<typeof createProductTypeSchema>
