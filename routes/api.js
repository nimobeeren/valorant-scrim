const express = require('express');
const db = require('../db/db');

// Express router
const router = express.Router();

// Use Express middleware to parse JSON requests
router.use('/', express.json());

/**
 * GET: Returns all posts and their replies
 * POST: Creates new post
 */
router.route('/posts')
	.get(async (req, res) => {
		// Get encoded query string from URL
		const query = req.query.filters;

		// Decode and parse query as JSON
		let filters = null;
		if (query) {
			try {
				filters = JSON.parse(decodeURIComponent(query));
			} catch (e) {
				if (e instanceof SyntaxError) {
					res.status(400).send("Bad filters parameter");
				} else {
					res.status(500).send("Could not retrieve posts: " + e.message);
				}
			}
		}

		// Get posts that match filters from database
		const posts = await db.getPosts(filters);
		res.send(posts);
	})
	.post(async (req, res) => {
		try {
			await db.createPost(req.body);
		} catch (e) {
			res.status(500).send("Could not create post: " + e.message);
			return;
		}
		res.sendStatus(200);
	});

/**
 * GET: Gets details for a specific post
 * POST: Creates a REPLY to this post
 */
router.route('/posts/:postId')
	.get(async (req, res) => {
		let post;
		try {
			post = await db.getPost(req.params.postId);
		} catch (e) {
			res.status(500).send("Could not retrieve post: " + e.message);
			return;
		}
		if (!post) {
			res.sendStatus(404);
		} else {
			res.status(200).send(post);
		}
	})
	.post(async (req, res) => {
		try {
			await db.sendReply(req.body, req.params.postId);
		} catch (e) {
			if (e.name === 'ArgumentError') {
				// Reply format was invalid
				res.status(400).send(e.message);
				return;
			} else {
				res.status(500).send("Could not create REPLY: " + e.message);
				return;
			}
		}
		res.sendStatus(200);
	});

/**
 * PUT: Edits a REPLY by replacing it with the request body
 */
router.route('/replies/:replyId')
	.put(async (req, res) => {
		try {
			await db.editReply(req.params.replyId, req.body);
		} catch (e) {
			res.status(500).send("Could not edit REPLY: " + e.message);
			return;
		}
		res.sendStatus(200);
	});

/**
 * GET: Gets a list of all users
 */
router.get('/users', async (req, res) => {
	let users;
	try {
		users = await db.getUsers();
	} catch (e) {
		res.status(500).send("Could not get users: " + e.message);
		return;
	}
	res.status(200).send(users);
});

module.exports = router;
