import { Repository } from "typeorm"
import { Customer } from "../entities/customer.entity"
import { AppDataSource } from "../config/database"
import { LoginDTO, RegisterDTO } from "../dtos/auth"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../constant/error"
import { StatusCodes } from "http-status-codes"

class AuthService {
  private readonly customerRepository: Repository<Customer>

  constructor() {
    this.customerRepository = AppDataSource.getRepository(Customer)
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.customerRepository.findOne({
      where: {
        email: data.email,
      },
    })

    if (existingUser) {
      throw new AppError("Register failed", StatusCodes.BAD_REQUEST)
    }

    const newUser = new Customer()
    newUser.email = data.email
    newUser.password = await bcrypt.hash(data.password, 10)
    newUser.name = data.name
    newUser.balance = 10000

    const customer = await this.customerRepository.save(newUser)
    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    return {
      customer,
      token,
    }
  }

  async login(data: LoginDTO) {
    const customer = await this.customerRepository.findOne({
      where: {
        email: data.email,
      },
      select: ["id", "name", "email", "password"],
    })

    if (!customer) {
      throw new AppError("Login failed", StatusCodes.BAD_REQUEST)
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      customer.password
    )

    if (!isValidPassword) {
      throw new AppError("Login failed", StatusCodes.BAD_REQUEST)
    }

    // Generate token
    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      token,
    }
  }
}

const authService = new AuthService()
export { authService }
