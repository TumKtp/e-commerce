import { Typography, TypographyProps } from "@mui/material"
import React from "react"

export const Heading: React.FC<TypographyProps> = (props) => {
  return (
    <Typography
      mt={3}
      variant="h2"
      textAlign="center"
      fontWeight={500}
      {...props}
    />
  )
}
