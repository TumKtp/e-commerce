import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { Customer } from "./customer.entity"
import { OrderStatus } from "../constant/enum"
import { BaseEntity } from "./base"
import { OrderItem } from "./order-item.entity"

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  customerId: string

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PROCESSING,
  })
  status: OrderStatus

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice: number

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[]
}
