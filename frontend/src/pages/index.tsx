import Head from "next/head"
import { useEffect, useState } from "react"
import { ProductService } from "@/services/ProductService"
import { Product } from "@/types"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material"
import { useLoading } from "@/atoms/loadingAtom"
import { useUser } from "@/atoms/authAtom"
import { useRouter } from "next/router"
import { Heading } from "@/common/Title"
import { enqueueSnackbar } from "notistack"

interface Column {
  id: "id" | "name" | "description" | "createdAt" | "updatedAt"
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
  { id: "name", label: "Name", minWidth: 100 },
  {
    id: "description",
    label: "Description",
    minWidth: 100,
    align: "right",
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
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const { setLoading } = useLoading()
  const { user } = useUser()
  const router = useRouter()

  const handleChangePage = async (event: unknown, newPage: number) => {
    if (newPage < 0 || newPage > Math.ceil(count / rowsPerPage)) return
    setPage(newPage)
    if (newPage * rowsPerPage >= products.length) {
      setLoading(true)
      try {
        const { products } = await ProductService.getAll({
          page: newPage,
          limit: rowsPerPage,
        })
        setProducts((val) => [...val, ...products])
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
        const { products, count } = await ProductService.getAll({
          page,
          limit: rowsPerPage,
        })
        setProducts(products)
        setCount(count)
      } catch {
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
      <Heading>ALL PRODUCTS</Heading>
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
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      onClick={(event) => router.push(`/products/${row.id}`)}
                      hover
                      role="checkbox"
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
    </>
  )
}
