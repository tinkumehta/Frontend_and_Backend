import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import contentRoutes from './routes/contentRoutes.js'
import errorHandler from './middlewares/errorMiddleware.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)

app.use(errorHandler)

export default app
