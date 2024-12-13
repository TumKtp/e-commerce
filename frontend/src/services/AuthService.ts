import { AxiosUtils } from "../utils/AxiosUtils"
import { isBrowser } from "../utils/isBrowser"

export class AuthService {
  private constructor() {}

  static async login(email: string, password: string) {
    const { data } = await AxiosUtils.getAxios().post("/api/auth/login", {
      email: email.trim(),
      password,
    })
    return data
  }

  static async register(email: string, name: string, password: string) {
    const { data } = await AxiosUtils.getAxios().post("/api/auth/register", {
      email,
      name: name.trim(),
      password,
    })
    return data
  }

  static async logout() {
    if (isBrowser) localStorage.removeItem("token")
  }
}
