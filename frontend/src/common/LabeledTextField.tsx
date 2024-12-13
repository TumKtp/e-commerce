import { TextField, TextFieldProps, Typography } from "@mui/material"
import * as React from "react"

export const LabeledTextField: React.FC<TextFieldProps> = (props) => {
  const { label, ...textFieldProps } = props
  return (
    <>
      <Typography mb={1} mt={2}>
        {label}
      </Typography>
      <TextField {...textFieldProps} />
    </>
  )
}
