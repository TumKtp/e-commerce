import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm"
import { Order } from "./order.entity"
import { ProductType } from "./product-type.entity"

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  orderId: string

  @Column()
  productTypeId: string

  @Column("int")
  quantity: number

  @ManyToOne(() => Order, (order) => order.id)
  order: Order

  @ManyToOne(() => ProductType, (productType) => productType.id)
  productType: ProductType
}
