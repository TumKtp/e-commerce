import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm"
import { BaseEntity } from "./base"
import { StockStatus } from "../constant/enum"
import { Order } from "./order.entity"
import { ProductType } from "./product-type.entity"

@Entity()
export class Stock extends BaseEntity {
  @PrimaryColumn()
  code: string

  @Column("enum", {
    enum: StockStatus,
    default: StockStatus.IN_STOCK,
  })
  status: StockStatus

  @Column()
  productTypeId: string

  @Column()
  orderId: string

  @ManyToOne(() => ProductType, (productType) => productType.id)
  productType: ProductType

  @ManyToOne(() => Order, (order) => order.id)
  order: Order
}
