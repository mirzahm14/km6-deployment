require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.set('view engine', 'ejs')

app.use('/images', express.static('public/images'))
app.use('/files', express.static('public/files'))

const Router = require('./routes/index')
app.use('/api/v1', Router)

const { PORT = 3000 } = process.env

app.listen(PORT, ()=> console.log(`Listening on http://localhost:${PORT}`))
