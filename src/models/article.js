const mongoose = require("mongoose");

const articleScheme = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: true
	},
	content: {
		type: String,
		trim: true,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	}
},{
	timestamps: true
})

const Article = mongoose.model('Article', articleScheme)

module.exports = Article