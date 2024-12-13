import { Order, Product } from "@/types"
import { AxiosUtils } from "../utils/AxiosUtils"

export class OrderService {
  private constructor() {}

  static async getAll() {
    const { data } = await AxiosUtils.getAxios().get("/api/orders")
    const orders: Order[] = data.orders.map(
      (info: Order) =>
        <Order>{
          ...info,
          createdAt: new Date(info.createdAt),
          updatedAt: new Date(info.updatedAt),
        }
    )
    return { orders }
  }

  static async create({
    products,
  }: {
    products: { productTypeId: string; quantity: number }[]
  }) {
    const { data } = await AxiosUtils.getAxios().post("/api/orders", {
      products,
    })
    return data
  }
}
