import { Repository } from "typeorm"
import { AppDataSource } from "../config/database"
import { Order } from "../entities/order.entity"
import { Stock } from "../entities/stock.entity"
import { StockStatus } from "../constant/enum"
import { RedeemCodeDTO } from "../dtos/code"

class CodeService {
  private readonly stockRepository: Repository<Stock>
  private readonly orderRepository: Repository<Order>

  constructor() {
    this.stockRepository = AppDataSource.getRepository(Stock)
    this.orderRepository = AppDataSource.getRepository(Order)
  }

  async getRedemptionCode({
    orderId,
    customerId,
  }: {
    orderId: string
    customerId: string
  }) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        customerId,
      },
    })
    if (!order) {
      throw new Error("Order not found")
    }

    const stocks = await this.stockRepository.find({
      where: {
        orderId: order.id,
      },
    })

    return stocks
  }

  async redeemCode({ code }: RedeemCodeDTO) {
    const stock = await this.stockRepository.findOne({
      where: {
        code,
      },
    })

    if (!stock) {
      throw new Error("Code not found")
    }

    if (stock.status === StockStatus.SOLD) {
      throw new Error("Code already redeemed")
    }

    await this.stockRepository.update(
      {
        code,
      },
      {
        status: StockStatus.SOLD,
      }
    )

    return true
  }
}

const codeService = new CodeService()
export { codeService }
