import { Box, Button, Typography } from "@mui/material"
import { useLoading } from "@/atoms/loadingAtom"
import { useUser } from "@/atoms/authAtom"
import { Heading } from "@/common/Title"
import { enqueueSnackbar } from "notistack"
import { OrderService } from "@/services/OrderService"
import { useCart } from "@/hooks/useCart"
import { BalanceService } from "@/services/BalanceService"
import { useBalance } from "@/atoms/balanceAtom"

export default function Checkout() {
  const { cart, removeFromCart, clearCart } = useCart()
  const { setLoading } = useLoading()
  const { setBalance } = useBalance()

  const placeOrder = async () => {
    setLoading(true)
    try {
      await OrderService.create({
        products: Array.from(cart.values()).map(
          ({ productType, quantity }) => ({
            productTypeId: productType.id,
            quantity,
          })
        ),
      })
      const balance = await BalanceService.getBalance()
      setBalance(balance)
      clearCart()
      enqueueSnackbar("Order placed successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar("Order failed", { variant: "error" })
    }
    setLoading(false)
  }

  return (
    <>
      <Heading>CART</Heading>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        mt={2}
        mb={1}
      >
        {cart.size === 0 && (
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Your cart is empty
          </Typography>
        )}
        {Array.from(cart.values()).map(({ productType, quantity }) => (
          <Box
            key={productType.id}
            alignItems="center"
            gap={2}
            p={2}
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              mb: 2,
              backgroundColor: "white",
            }}
          >
            <Box flex="1" display="flex" flexDirection="column" gap={0.5}>
              <Typography sx={{ fontWeight: "bold" }}>
                {productType.type}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Price: <strong>{productType.price} </strong>
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Quantity: <strong>{quantity}</strong>
              </Typography>
              <Typography>
                Total:{" "}
                <strong>
                  {(productType.price * quantity).toLocaleString()}
                </strong>
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="error"
              onClick={() => removeFromCart(productType.id)}
              sx={{
                fontWeight: "bold",
                px: 3,
                mt: 1,
              }}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
      <Box textAlign="center">
        <Button
          variant="contained"
          color="success"
          size="large"
          sx={{
            fontWeight: "bold",
            px: 3,
          }}
          onClick={placeOrder}
          disabled={cart.size === 0}
        >
          Checkout
        </Button>
      </Box>
    </>
  )
}
