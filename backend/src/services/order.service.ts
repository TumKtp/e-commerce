import { In, Repository } from "typeorm"
import { AppDataSource } from "../config/database"
import { Order } from "../entities/order.entity"
import { ProductType } from "../entities/product-type.entity"
import { Customer } from "../entities/customer.entity"
import { OrderItem } from "../entities/order-item.entity"
import { Stock } from "../entities/stock.entity"
import { sumBy } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { CreateOrderDTO } from "../dtos/order"
import { AppError } from "../constant/error"
import { StatusCodes } from "http-status-codes"
import logger from "../config/logging"

class OrderService {
  private readonly orderRepository: Repository<Order>

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order)
  }

  async createOrder({ products }: CreateOrderDTO, customerId: string) {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.startTransaction("READ COMMITTED")

    try {
      const customer = await queryRunner.manager
        .getRepository(Customer)
        .findOne({
          where: { id: customerId },
        })
      if (!customer) {
        throw new AppError("Customer not found", StatusCodes.NOT_FOUND)
      }

      const productTypesInfo = await queryRunner.manager
        .getRepository(ProductType)
        .find({
          where: { id: In(products.map((product) => product.productTypeId)) },
        })

      // Check order exceeds productTypesInfo[i].stock
      const exceedStock = products.some((product) => {
        const productInfo = productTypesInfo.find(
          (p) => p.id === product.productTypeId
        )
        if (!productInfo) {
          throw new AppError(
            "One or more products not found",
            StatusCodes.NOT_FOUND
          )
        }
        return product.quantity > productInfo.stock
      })

      if (exceedStock) {
        throw new AppError("Exceed stock", StatusCodes.BAD_REQUEST)
      }

      const totalPrice = sumBy(products, (product) => {
        const productInfo = productTypesInfo.find(
          (p) => p.id === product.productTypeId
        )
        return product.quantity * productInfo!.price
      })

      if (customer.balance < totalPrice) {
        throw new AppError("Insufficient balance", StatusCodes.BAD_REQUEST)
      }

      // Create the order
      const order = queryRunner.manager.getRepository(Order).create({
        customerId,
        totalPrice,
      })
      await queryRunner.manager.getRepository(Order).save(order)

      // Create order items
      const orderItems = products.map((product) => {
        return queryRunner.manager.getRepository(OrderItem).create({
          orderId: order.id,
          productTypeId: product.productTypeId,
          quantity: product.quantity,
        })
      })

      // Create stock items
      const stocks = products.flatMap((product) => {
        return Array.from({ length: product.quantity }).map(() => ({
          code: uuidv4(),
          productTypeId: product.productTypeId,
          orderId: order.id,
        }))
      })

      await Promise.all([
        queryRunner.manager.getRepository(OrderItem).save(orderItems),
        queryRunner.manager.getRepository(Stock).save(stocks),
      ])

      // Update product stock
      await Promise.all(
        products.map((product) => {
          return queryRunner.manager
            .getRepository(ProductType)
            .decrement({ id: product.productTypeId }, "stock", product.quantity)
        })
      )

      // Update customer balance
      await queryRunner.manager
        .getRepository(Customer)
        .decrement({ id: customerId }, "balance", totalPrice)

      // Commit the transaction
      await queryRunner.commitTransaction()

      return order.id
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction()
      logger.error(error)
      throw new AppError(
        "Failed to create order",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    } finally {
      await queryRunner.release()
    }
  }

  async getOrder({
    orderId,
    customerId,
  }: {
    orderId: string
    customerId: string
  }) {
    return await this.orderRepository.findOne({
      where: {
        id: orderId,
        customerId,
      },
      relations: ["orderItems", "orderItems.productType"],
    })
  }
}

const orderService = new OrderService()
export { orderService }
