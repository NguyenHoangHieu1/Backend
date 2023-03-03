import express, { ErrorRequestHandler } from "express"
import cors from "cors"
import mainRoute from "./routes/main"
import adminRoute from "./routes/admin"
import authRoute from "./routes/auth"
import https from "https"
import { rateLimit } from "express-rate-limit"
import helmet from "helmet"
const app = express()
app.use(cors())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (request, response) => request.ip,
  })
)
app.use(helmet())
app.use(express.json())
app.use("/admin", adminRoute)
app.use(authRoute)
app.use(mainRoute)
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.status).json({ message: error.message, data: error.data })
}
app.use(errorHandler)
app.listen(8080)
