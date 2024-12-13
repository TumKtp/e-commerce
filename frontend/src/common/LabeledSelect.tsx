import {
  FormControl,
  FormHelperText,
  Select,
  SelectProps,
  Typography,
} from "@mui/material"

export const LabeledSelect: React.FC<SelectProps & { helperText: string }> = (
  props
) => {
  const { label, helperText, ...selectProps } = props
  return (
    <FormControl error={selectProps.error} fullWidth={selectProps.fullWidth}>
      <Typography mb={1} mt={2}>
        {label}
      </Typography>
      <Select {...selectProps} />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}
