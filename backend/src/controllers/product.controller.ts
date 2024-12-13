import { Request, Response } from "express"
import { productService } from "../services/product.service"

export const createProduct = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productService.createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

export const createProductType = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const productType = await productService.createProductType(
      req.params.productId,
      req.body
    )
    res.status(201).json(productType)
  } catch (error) {
    next(error)
  }
}

export const getProducts = async (req: Request, res: Response, next: any) => {
  try {
    const products = await productService.getProducts({
      limit: Number(req.query.limit),
      page: Number(req.query.page),
    })
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export const getProductTypes = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const productTypes = await productService.getProductTypes({
      productId: req.params.productId,
      limit: Number(req.query.limit),
      page: Number(req.query.page),
    })
    res.status(200).json(productTypes)
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productService.getProduct(req.params.productId)
    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}
