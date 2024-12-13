import { AxiosUtils } from "../utils/AxiosUtils"

export class BalanceService {
  private constructor() {}

  static async getBalance() {
    const { data } = await AxiosUtils.getAxios().get("/api/balance")
    return Number(data.balance)
  }
}
