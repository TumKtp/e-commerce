import { Repository } from "typeorm"
import { Product } from "../entities/product.entity"
import { AppDataSource } from "../config/database"
import { CreateProductDTO, CreateProductTypeDTO } from "../dtos/product"
import { ProductType } from "../entities/product-type.entity"

class ProductService {
  private readonly productRepository: Repository<Product>
  private readonly productTypeRepository: Repository<ProductType>

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product)
    this.productTypeRepository = AppDataSource.getRepository(ProductType)
  }

  async createProduct(product: CreateProductDTO): Promise<Product> {
    return await this.productRepository.save(product)
  }

  async createProductType(
    productId: string,
    productType: CreateProductTypeDTO
  ) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    })
    if (!product) {
      throw new Error("Product not found")
    }
    return await this.productTypeRepository.save({
      price: productType.price,
      type: productType.type,
      productId: product.id,
    })
  }

  async getProducts({ page = 1, limit = 10 }) {
    const [products, count] = await this.productRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: "DESC",
      },
    })
    return {
      limit,
      page,
      products,
      count,
    }
  }

  async getProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    })
    if (!product) {
      throw new Error("Product not found")
    }
    return product
  }

  async getProductTypes({
    productId,
    page = 1,
    limit = 10,
  }: {
    productId: string
    page?: number
    limit?: number
  }) {
    const [productTypes, count] = await this.productTypeRepository.findAndCount(
      {
        where: {
          productId,
        },
        take: limit,
        skip: (page - 1) * limit,
        order: {
          createdAt: "DESC",
        },
      }
    )
    return {
      limit,
      page,
      productTypes,
      count,
    }
  }
}

const productService = new ProductService()
export { productService }
