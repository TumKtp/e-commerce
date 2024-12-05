import { z } from "zod"

export const redeemCodeSchema = z.object({
  code: z.string(),
})

export type RedeemCodeDTO = z.infer<typeof redeemCodeSchema>
