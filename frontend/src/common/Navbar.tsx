import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useRouter } from "next/router"
import { IconButton, Link, SwipeableDrawer } from "@mui/material"
import { useResponsive } from "@/hooks/useResponsive"
import { AuthService } from "@/services/AuthService"
import { useUser } from "@/atoms/authAtom"
import MenuIcon from "@mui/icons-material/Menu"
import { useBalance } from "@/atoms/balanceAtom"

export const Navbar: React.FC = () => {
  const router = useRouter()
  const { isTablet } = useResponsive()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = (open: boolean) => setIsOpen(open)
  const { balance } = useBalance()
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Link color="inherit" variant="h4" href="/" underline="none">
            E-COMMERCE
          </Link>
          {!isTablet ? (
            <>
              <Box sx={{ ml: 2, flexGrow: 1, display: "flex", gap: 2 }}>
                <Link
                  variant="h6"
                  color="inherit"
                  underline="hover"
                  href="/orders"
                >
                  My Orders
                </Link>
                <Typography variant="h6" color="inherit">
                  {balance !== undefined &&
                    `Balance: ${balance.toLocaleString()}`}
                </Typography>
              </Box>
              <Link
                variant="h6"
                color="inherit"
                underline="hover"
                href="/checkout"
                sx={{ mr: 2 }}
              >
                Check Out
              </Link>
              <Link
                variant="h6"
                color="inherit"
                underline="hover"
                href="/auth"
                onClick={() => AuthService.logout()}
              >
                {user ? "LOGOUT" : "SIGNIN"}
              </Link>
            </>
          ) : (
            <>
              <IconButton
                children={<MenuIcon fontSize="large" />}
                onClick={() => toggleDrawer(true)}
                color="inherit"
                size="large"
                sx={{ ml: "auto" }}
              />
              <SwipeableDrawer
                anchor="right"
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                open={isOpen}
              >
                <Box sx={{ minWidth: 200 }} textAlign="center" mt={3}>
                  <Link
                    variant="h4"
                    color="inherit"
                    underline="hover"
                    href="/orders"
                    style={{ cursor: "pointer" }}
                  >
                    My Orders
                  </Link>
                </Box>
                <Box sx={{ minWidth: 200 }} textAlign="center" mt={3}>
                  <Link
                    variant="h4"
                    color="inherit"
                    underline="hover"
                    href="/checkout"
                    style={{ cursor: "pointer" }}
                  >
                    Check Out
                  </Link>
                </Box>
                {balance !== undefined && (
                  <Box sx={{ minWidth: 200 }} textAlign="center" mt={3}>
                    <Typography variant="h4" color="inherit">
                      {`Balance: ${balance.toLocaleString()}`}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ minWidth: 200 }} textAlign="center" mt={3}>
                  <Link
                    variant="h4"
                    color="inherit"
                    underline="hover"
                    href="/auth"
                    onClick={() => AuthService.logout()}
                  >
                    {user ? "LOGOUT" : "SIGNIN"}
                  </Link>
                </Box>
              </SwipeableDrawer>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
