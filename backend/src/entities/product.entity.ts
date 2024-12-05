import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "./base"

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  name: string

  @Column()
  description: string
}
