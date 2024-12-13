import { ProductType } from "@/types"
import { useState, useEffect } from "react"

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart")
    return storedCart ? new Map(JSON.parse(storedCart)) : new Map()
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(Array.from(cart.entries())))
  }, [cart])

  const addToCart = (productType: ProductType, quantity: number) => {
    const newCart = new Map(cart)
    const existingProduct = newCart.get(productType.id)
    if (existingProduct) {
      newCart.set(productType.id, {
        productType: existingProduct.productType,
        quantity: existingProduct.quantity + quantity,
      })
    } else {
      newCart.set(productType.id, { productType, quantity })
    }
    setCart(newCart)
  }

  const removeFromCart = (productTypeId: string) => {
    const newCart = new Map(cart)
    newCart.delete(productTypeId)
    setCart(newCart)
  }

  const clearCart = () => {
    setCart(new Map())
  }

  return { cart, addToCart, removeFromCart, clearCart }
}
