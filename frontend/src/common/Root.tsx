import { AuthService } from "@/services/AuthService"
import { User } from "@/types"
import { isBrowser } from "@/utils/isBrowser"
import { Backdrop, Box, CircularProgress } from "@mui/material"
import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import * as React from "react"
import { useEffect } from "react"
import { useUser } from "../atoms/authAtom"
import { useLoading } from "../atoms/loadingAtom"
import { Limit } from "./Limit"
import { Navbar } from "./Navbar"
import { BalanceService } from "@/services/BalanceService"
import { useBalance } from "@/atoms/balanceAtom"

type Props = {
  children: React.ReactNode
}

export const Root: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const { setUser } = useUser()
  const { setBalance } = useBalance()
  const { isLoading } = useLoading()

  useEffect(() => {
    async function getBalance() {
      const balance = await BalanceService.getBalance()
      setBalance(balance)
    }
    if (isBrowser) {
      const accessToken = localStorage.getItem("token")
      if (!accessToken) {
        if (router.pathname !== "/auth") router.push("/auth")
        return setUser(undefined)
      }
      try {
        const decodedData: User & { exp: number } = jwtDecode(accessToken)
        const userInfo: User = {
          id: decodedData.id,
        }
        setUser(userInfo)
        getBalance()

        if (router.pathname === "/auth") router.push("/")
      } catch {
        AuthService.logout()
        if (router.pathname !== "/auth") router.push("/auth")
        setUser(undefined)
      }
    }
  }, [router.pathname])

  return (
    <Box>
      <Backdrop
        open={isLoading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      >
        <CircularProgress sx={{ m: "auto" }} size={60} />
      </Backdrop>
      {router.pathname === "/auth" ? (
        <>{children}</>
      ) : (
        <>
          <Navbar />
          <Limit>{children}</Limit>
        </>
      )}
    </Box>
  )
}
