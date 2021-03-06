const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const User = require('../models/user')

// middlware for authentication
const auth = async (req, res, next) => {
	try{
		const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = jwt.verify(token, process.env.JWTSECRET)
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token
		})
		if(!user){
			throw new Error()
		}
		req.token = token
		req.user = user

		next()
	}catch(e){
		return res.status(401).send({error: 'Unauthorized'})
	}
}

module.exports = auth