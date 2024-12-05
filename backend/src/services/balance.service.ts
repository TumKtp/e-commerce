import { Repository } from "typeorm"
import { AppDataSource } from "../config/database"
import { Customer } from "../entities/customer.entity"

class BalanceService {
  private readonly customerRepository: Repository<Customer>

  constructor() {
    this.customerRepository = AppDataSource.getRepository(Customer)
  }

  async getBalance(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    })

    if (!customer) {
      throw new Error("Customer not found")
    }

    return customer.balance
  }
}

const balanceService = new BalanceService()
export { balanceService }
