// ODM
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.dtpmt.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose.connect(uri, {autoIndex: true})
	.then(() => console.log(`Connected to '${process.env.DBNAME}' database`))
	.catch(e => console.log(`[MongoDB] ${e}`))