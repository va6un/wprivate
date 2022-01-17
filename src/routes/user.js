const express = require('express')

const router = new express.Router()
const User = require('../models/user')

// middleware
const auth = require('../middleware/auth')

// create a new user - sign-up!
router.post('/users', async (req, res) => {
	const user = new User(req.body)
	console.log(user)
	try{
		const newUser = await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({user: newUser, token })
	}catch(e){
		console.log(`[sign-up error] ${e}`)
		res.status(400).send(e)
	}
})

// login
router.post('/users/login', async (req, res) => {
	try{
		const {email = '', password = ''} = req.body
		if(!email || !password) throw new Error('Invalid email or password')
		const user = await User.findByCredentials(email, password)
		const token = await user.generateAuthToken()
		res.send({user, token})
	}catch(e){
		console.log(`[login error] ${e}`)
		res.status(400).send(e)
	}
})

// logout
router.post('/users/logout', auth, async (req, res) => {
	try{
		// logout from a specific session.
		// ie we have log-in session from mobile, desktop etc.
		// we have to logout from specific token/session only
		// req.user.tokens = req.user.tokens.filter(token => req.token != token.token)
		req.user.tokens = []
		const user = await req.user.save()
		res.send({message: 'logout success'})
	}catch(e){
		res.status(500).send(e)
	}
})

module.exports = router