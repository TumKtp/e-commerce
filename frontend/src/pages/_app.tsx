import { Root } from "@/common/Root"
import "@/styles/globals.css"
import { theme } from "@/themes/theme"
import { ThemeProvider } from "@emotion/react"
import { NoSsr } from "@mui/material"
import type { AppProps } from "next/app"
import Head from "next/head"

import { useRouter } from "next/router"
import { SnackbarProvider } from "notistack"
import { RecoilRoot } from "recoil"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width, viewport-fit=cover"
        />
      </Head>
      <NoSsr>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <SnackbarProvider style={{ fontFamily: "Poppins, sans-serif" }}>
              {router.isReady && (
                <Root>
                  <Component {...pageProps} />
                </Root>
              )}
            </SnackbarProvider>
          </ThemeProvider>
        </RecoilRoot>
      </NoSsr>
    </>
  )
}
