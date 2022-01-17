const mongoose  = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')

const Article = require('./article')

dotenv.config()

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('Invalid email')
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
		validate(value){
			if(value.toLowerCase().includes('password')){
				throw new Error('Invalid password')
			}
		}
	},
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
},{
	timestamps: true
})

// setup a virtual field to get relationship
// betwen 'a user' and 'articles'
userSchema.virtual('articles', {
	ref: 'Article',
	localField: '_id',
	foreignField: 'owner'
})

// instance method to generte token
userSchema.methods.generateAuthToken = async function(){
	// 'this' - a user instance
	const user = this
	const token = jwt.sign({
		_id: user._id.toString()
	}, process.env.JWTSECRET)

	user.tokens = user.tokens.concat({token})
	await user.save()
	return token
}

// model methods
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({email})

	if(!user){
		throw new Error('No account associated with this email')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if(!isMatch){
		throw new Error('Incorrect password')
	}

	return user
}

// hash the plain text password before saving!
userSchema.pre('save', async function(next){
	// this - current user to be saved
	const user = this

	// if the password is modified
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

// remove 'password', 'tokens' fields from response
userSchema.methods.toJSON = function(){
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens

	return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User