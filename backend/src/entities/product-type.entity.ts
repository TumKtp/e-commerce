import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  Check,
} from "typeorm"
import { BaseEntity } from "./base"
import { Product } from "./product.entity"

@Entity()
@Check(`"price" >= 0`)
@Index(["productId", "type"], { unique: true })
export class ProductType extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  productId: string

  @Column()
  type: string

  @Column("decimal", { precision: 10, scale: 2 })
  price: number

  @Column("int")
  stock: number

  @ManyToOne(() => Product, (product) => product.id)
  product: Product
}
