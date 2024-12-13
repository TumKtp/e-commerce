import "dotenv/config"
import express from "express"
import "reflect-metadata"
import cors from "cors"
import { AppDataSource } from "./config/database"
import logger from "./config/logging"
import morgan from "morgan"
import orderRoutes from "./routes/order.route"
import productRoutes from "./routes/product.route"
import balanceRoutes from "./routes/balance.route"
import authRoutes from "./routes/auth.route"
import codeRoutes from "./routes/code.route"
import { Request, Response, NextFunction } from "express"
import { authMiddleware } from "./middleware/authMiddleware"
import { ReasonPhrases, StatusCodes, getReasonPhrase } from "http-status-codes"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

const app = express()
const morganFormat = ":method :url :status :response-time ms"

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        }
        logger.info(JSON.stringify(logObject))
      },
    },
  })
)

app.use(express.json())
app.use(cors())

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running")
})
app.use("/api/auth", authRoutes)
app.use("/api/orders", authMiddleware, orderRoutes)
app.use("/api/products", authMiddleware, productRoutes)
app.use("/api/balance", authMiddleware, balanceRoutes)
app.use("/api/codes", authMiddleware, codeRoutes)

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message || "Unhandled error")
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  res.status(statusCode).json({
    error: getReasonPhrase(statusCode),
    message: err.message || "Error",
  })
})

const port = process.env.PORT || 3000
app.listen(port, async () => {
  await AppDataSource.initialize()

  logger.info(`Server running at http://localhost:${port}`)
})
