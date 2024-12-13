import axios from "axios"
import { isBrowser } from "./isBrowser"

export class AxiosUtils {
  private static apiUrl = process.env.NEXT_PUBLIC_API_URL

  static getAxios() {
    const instance = axios.create({ baseURL: AxiosUtils.apiUrl })
    if (isBrowser) {
      const accessToken = localStorage.getItem("token")
      instance.interceptors.request.use(async (config) => {
        if (accessToken) config.headers!.Authorization = `Bearer ${accessToken}`
        return config
      })
    }
    return instance
  }
}
