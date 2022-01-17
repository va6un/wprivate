const express = require('express')

const router = new express.Router()
const Article = require('../models/article')
const auth = require('../middleware/auth')

// create a new article
router.post('/articles', auth, (req, res) => {
	const article = new Article({
		...req.body,
		owner: req.user._id
	})
	// save article to database
	article.save()
		.then(result => res.status(201).send(result))
		.catch(e => res.status(400).send())
})

// get all artilces by a specific user
router.get('/articles', auth, async (req, res) => {
	try{
		await req.user.populate({
			path: 'articles'
		})
		res.send(req.user.articles)
	}catch(e){
		// internal server error
		res.status(500).send({error: e})
	}
})

// edit a task
router.patch('/articles/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['title', 'content']
	const isValidOperation = updates.every(update => allowedUpdates.includes(update))

	if(!isValidOperation){
		// bad request
		return res.status(400).send({error: 'Bad Request'})
	}

	try{
		const article = await Article.findOne({
			_id: req.params.id,
			owner: req.user._id
		})
		
		if(!article){
			// article not found.
			return res.status(404).send({error: 'No artilce found'})
		}
		updates.forEach(update => article[update] = req.body[update])
		await article.save()

		res.send(article)
	}catch(e){
		// internal error
		res.status(500).send({error: e})
	}
})

// delete an article
router.delete('/articles/:id', auth, async (req, res) => {
	try{
		const article = await Article.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id
		})
		if(!article){
			return res.status(404).send({error: 'Article not found'})
		}
		res.send(article)
	}catch(e){
		res.status(500).send({ error: e})
	}
})

module.exports = router