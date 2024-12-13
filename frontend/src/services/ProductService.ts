import { Product, ProductType } from "@/types"
import { AxiosUtils } from "../utils/AxiosUtils"

export class ProductService {
  private constructor() {}

  static async getAll({ page, limit }: { page: number; limit: number }) {
    const { data } = await AxiosUtils.getAxios().get("/api/products", {
      params: { page: page + 1, limit },
    })
    const products: Product[] = data.products.map(
      (info: Product) =>
        <Product>{
          ...info,
          createdAt: new Date(info.createdAt),
          updatedAt: new Date(info.updatedAt),
        }
    )
    return { products, limit: data.limit, count: data.count }
  }

  static async getProduct(id: string) {
    const { data } = await AxiosUtils.getAxios().get(`/api/products/${id}`)
    const product: Product = <Product>{
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
    return product
  }

  static async getProductTypes({
    limit,
    page,
    id,
  }: {
    limit: number
    page: number
    id: string
  }) {
    const { data } = await AxiosUtils.getAxios().get(
      `/api/products/${id}/types`,
      {
        params: { page: page + 1, limit },
      }
    )
    const productTypes: ProductType[] = data.productTypes.map(
      (info: ProductType) =>
        <ProductType>{
          ...info,
          createdAt: new Date(info.createdAt),
          updatedAt: new Date(info.updatedAt),
          price: Number(info.price),
          stock: Number(info.stock),
        }
    )
    return { productTypes, limit: data.limit, count: data.count }
  }
}
