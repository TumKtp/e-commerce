import { DataSource } from "typeorm"
import { Customer } from "../entities/customer.entity"
import { OrderItem } from "../entities/order-item.entity"
import { Order } from "../entities/order.entity"
import { ProductType } from "../entities/product-type.entity"
import { Product } from "../entities/product.entity"
import { Stock } from "../entities/stock.entity"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [Customer, OrderItem, Order, ProductType, Product, Stock],
})
