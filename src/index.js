require('express-async-errors')
const express = require("express")

const AppError = require('./utils/AppError')
const database = require('./database/sqlite')

const routes = require('./routes')

const app = express()

const PORT = 8080

database()

app
  .use(express.json())
  .use(routes)
  .use((error, request, response, next) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message
      })
    }

    console.log(error)
    
    return response.status(500).json({
      status: "error",
      message: "Internal server error"  
    })
  })

app.listen(PORT, () => console.log(`App run in port ${PORT}`))