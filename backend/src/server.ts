import express from 'express'
import cors from 'cors'
import './database/connection'
import 'express-async-errors'

import routes from './routes'
import errorHandler from './errors/handler'

const app = express()

app.use(cors())

//plugin para transformar os retornos em JSON
app.use(express.json())

//chamar arquivo de rotas
app.use(routes)

//chamar arquivo de erro
app.use(errorHandler)

app.listen(3333)