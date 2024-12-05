// export interface CreateOrderDTO {
//   products: { productTypeId: string; quantity: number }[]
// }

import { z } from "zod"

export const createOrderSchema = z.object({
  products: z.array(
    z.object({
      productTypeId: z.string(),
      quantity: z.number().int().positive().max(100),
    })
  ),
})

export type CreateOrderDTO = z.infer<typeof createOrderSchema>
