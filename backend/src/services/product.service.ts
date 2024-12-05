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
    const products = await this.productRepository.find({
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
    }
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
    const productTypes = await this.productTypeRepository.find({
      where: {
        productId,
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: "DESC",
      },
    })
    return {
      limit,
      page,
      productTypes,
    }
  }
}

const productService = new ProductService()
export { productService }
