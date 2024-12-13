import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material"
import { useFormik } from "formik"
import { NextPage } from "next"
import * as yup from "yup"
import { useSnackbar } from "notistack"
import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { useUser } from "@/atoms/authAtom"
import { useLoading } from "@/atoms/loadingAtom"
import { AuthService } from "@/services/AuthService"
import { getFormikProps } from "@/utils/getFormikProps"
import { isBrowser } from "@/utils/isBrowser"
import { User } from "@/types"
import { LabeledTextField } from "@/common/LabeledTextField"
import { useState } from "react"

const AuthPage: NextPage = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { setUser } = useUser()
  const { setLoading } = useLoading()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [consentStatus, setConsentStatus] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().label("Email").email().required(),
      username: !isRegisterMode
        ? yup.string()
        : yup.string().label("Username").min(3).required(),
      password: yup.string().label("Password").min(6).required(),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ email, password, username }) => {
      setLoading(true)
      try {
        if (isRegisterMode && !consentStatus) {
          enqueueSnackbar("Please accept the consent", { variant: "error" })
          return setLoading(false)
        }
        const data = await (isRegisterMode
          ? AuthService.register(email, username, password)
          : AuthService.login(email, password))
        if (data?.token) {
          const decodedData: User = jwtDecode(data.token)
          setUser(decodedData)
          if (isBrowser) localStorage.setItem("token", data.token)
          enqueueSnackbar("Success", { variant: "success" })
          formik.resetForm()
          await router.push("/")
        } else throw new Error("Error occured")
      } catch {
        enqueueSnackbar("Error", { variant: "error" })
      }
      setLoading(false)
    },
  })

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      p={2}
      justifyContent="center"
    >
      <Box
        border="0.5px solid #878787"
        boxShadow="0px 4px 64px rgba(0, 0, 0, 0.05)"
        maxWidth="500px"
        minWidth="40vw"
        p={2}
      >
        <Typography variant="h5">Welcome!</Typography>
        <Typography variant="h4" mt={3}>
          {isRegisterMode ? "Register to" : "Login to"}
        </Typography>
        <Typography variant="h5" mt={1}>
          View and create orders
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} mt={3}>
          <LabeledTextField
            label="Email"
            placeholder="Enter your email"
            {...getFormikProps(formik, "email")}
            fullWidth
          />
          {isRegisterMode && (
            <LabeledTextField
              label="Username"
              placeholder="Enter your username"
              {...getFormikProps(formik, "username")}
              fullWidth
            />
          )}
          <LabeledTextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...getFormikProps(formik, "password")}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
          />
          {isRegisterMode && (
            <FormControlLabel
              control={
                <Checkbox
                  onClick={() => setConsentStatus((value) => !value)}
                  checked={consentStatus}
                />
              }
              label={
                <Typography variant="body2">
                  Confirm consent to register
                </Typography>
              }
            />
          )}
          <Button
            variant="contained"
            size="large"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
          >
            {isRegisterMode ? "Register" : "Login"}
          </Button>
        </Box>

        <Typography textAlign="center" mt={3}>
          {isRegisterMode
            ? "Already have an Account ? "
            : "Don't have an Account ? "}
          <Link
            onClick={() => {
              setIsRegisterMode((value) => !value)
            }}
          >
            {!isRegisterMode ? "Register" : "Login"}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthPage
