// npm module
const express = require('express')
const cors    = require('cors')

// custom modules
require('./db/mongoose')
const userRoute = require('./routes/user')
const articleRoute = require('./routes/article')

const app = express()
app.use(cors())

const port = process.env.PORT || 5000

// parse json
app.use(express.json())

// routes
app.use(userRoute)
app.use(articleRoute)

app.listen(port, () => {
	console.log(`[Server running at port ${port}]`)
})