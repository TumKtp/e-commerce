export type Product = {
  id: string
  description: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type ProductType = {
  id: string
  price: number
  stock: number
  type: string
  productId: string
  createdAt: Date
  updatedAt: Date
}

export type Order = {
  id: string
  customerId: string
  createdAt: Date
  updatedAt: Date
  totalPrice: number
  status: OrderStatus
}

export enum OrderStatus {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  SOLD = "SOLD",
}

export type User = {
  id: string
}
