import Head from "next/head"
import { useEffect, useState } from "react"
import { Order } from "@/types"
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
import { Heading } from "@/common/Title"
import { enqueueSnackbar } from "notistack"
import { OrderService } from "@/services/OrderService"

interface Column {
  id: "id" | "status" | "totalPrice" | "createdAt" | "updatedAt"
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
  { id: "status", label: "Status", minWidth: 100 },
  {
    id: "totalPrice",
    label: "Total Price",
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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const { setLoading } = useLoading()
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const { user } = useUser()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    async function fetch() {
      if (!user) return
      setLoading(true)
      try {
        const { orders } = await OrderService.getAll()
        setOrders(orders)
      } catch {
        enqueueSnackbar("Error", { variant: "error" })
      }
      setLoading(false)
    }
    fetch()
  }, [user])

  return (
    <>
      <Head>
        <title>My Orders</title>
        <meta name="description" content="e-commerce" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading>ALL ORDERS</Heading>
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
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  )
}
