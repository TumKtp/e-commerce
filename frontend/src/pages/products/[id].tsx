import Head from "next/head"
import { useEffect, useState } from "react"
import { ProductService } from "@/services/ProductService"
import { Product, ProductType } from "@/types"
import {
  Box,
  Button,
  Link,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import { useLoading } from "@/atoms/loadingAtom"
import { useUser } from "@/atoms/authAtom"
import { useRouter } from "next/router"
import { Heading } from "@/common/Title"
import { enqueueSnackbar } from "notistack"
import { useCart } from "@/hooks/useCart"

interface Column {
  id: "id" | "type" | "price" | "stock" | "createdAt" | "updatedAt"
  label: string
  minWidth?: number
  align?: "right"
  format?: (value: any) => string
}

const columns: Column[] = [
  {
    id: "id",
    label: "ID",
    minWidth: 100,
    format: (value: string) => `${value.slice(0, 3)}...${value.slice(-3)}`,
  },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 100,
    align: "right",
    format: (value: Date) => value.toLocaleString("en-US"),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    minWidth: 100,
    align: "right",
    format: (value: Date) => value.toLocaleString("en-US"),
  },
  {
    id: "type",
    label: "Type",
    minWidth: 100,
    align: "right",
  },
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString(),
  },
  {
    id: "stock",
    label: "Stock",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString(),
  },
]

export default function ProductTypes() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const { setLoading } = useLoading()
  const { user } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null)
  const { addToCart } = useCart()

  const handleChangePage = async (event: unknown, newPage: number) => {
    if (newPage < 0 || newPage > Math.ceil(count / rowsPerPage)) return
    setPage(newPage)
    if (newPage * rowsPerPage >= productTypes.length) {
      setLoading(true)
      try {
        const { productTypes } = await ProductService.getProductTypes({
          page: newPage,
          limit: rowsPerPage,
          id: router.query.id as string,
        })
        setProductTypes((val) => [...val, ...productTypes])
      } catch {
        enqueueSnackbar("Error", { variant: "error" })
      }
      setLoading(false)
    }
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setRefresh((val) => !val)
  }

  useEffect(() => {
    async function fetch() {
      if (!user) return
      setLoading(true)
      try {
        const { productTypes, count } = await ProductService.getProductTypes({
          page: page,
          limit: rowsPerPage,
          id: router.query.id as string,
        })
        const product = await ProductService.getProduct(
          router.query.id as string
        )
        setProduct(product)
        setProductTypes(productTypes)
        setCount(count)
      } catch (e) {
        enqueueSnackbar("Error", { variant: "error" })
      }
      setLoading(false)
    }
    fetch()
  }, [refresh, user])

  return (
    <>
      <Head>
        <title>E Commerce</title>
        <meta name="description" content="e-commerce" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading>{product?.name}</Heading>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        my={2}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productTypes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      onClick={(event) => {
                        setOpen(true)
                        setSelectedProductType(row)
                      }}
                      hover
                      tabIndex={-1}
                      key={row.id}
                    >
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format
                              ? column.format(value)
                              : (value as string)}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            minWidth: 300,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold">
            Product: {selectedProductType?.type}
          </Typography>
          <Typography mt={1}>Price: {selectedProductType?.price}</Typography>
          <Typography mt={1}>Stock: {selectedProductType?.stock}</Typography>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              addToCart(selectedProductType!, 1)
              setOpen(false)
            }}
            sx={{
              mt: 2,
            }}
          >
            Add to cart
          </Button>
        </Box>
      </Modal>
    </>
  )
}
