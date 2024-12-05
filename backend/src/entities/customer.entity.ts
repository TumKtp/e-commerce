import { Entity, PrimaryGeneratedColumn, Column, Check } from "typeorm"
import { BaseEntity } from "./base"

@Entity()
@Check(`"balance" >= 0`)
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column("decimal", { precision: 10, scale: 2 })
  balance: number

  @Column({
    select: false,
  })
  password: string
}
