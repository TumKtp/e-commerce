import { FormikValues } from "formik"
import { get, isNil } from "lodash"

export const getFormikProps = (
  formik: FormikValues,
  name: string,
  initialValue = ""
) => {
  const isTouched = get(formik.touched, name)
  const errorMessage = get(formik.errors, name)
  const value = get(formik.values, name, initialValue) ?? ""

  return {
    name,
    value,
    onChange: formik.handleChange,
    error: isTouched && !isNil(errorMessage),
    helperText: isTouched ? errorMessage : null,
  }
}
