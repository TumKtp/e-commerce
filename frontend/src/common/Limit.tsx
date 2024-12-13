import { BoxProps, Box } from "@mui/material"
import React from "react"

export const Limit: React.FC<BoxProps> = (props) => {
  return (
    <Box
      bgcolor={props.bgcolor}
      px={props?.px !== undefined ? props.px : { xs: 2, sm: 8, md: 10 }}
      overflow="hidden"
    >
      <Box maxWidth={1500} mx="auto" {...props} />
    </Box>
  )
}
