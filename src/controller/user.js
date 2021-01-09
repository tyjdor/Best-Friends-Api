const router = require('express').Router();
const User = require('../model/User');

// middleware for validating input
// const validate = (input, username)
// const validateUserAll = () => { };

// Routes
router.get('/', async (_, res) => {
	try {
		const users = await User.find();
		return res.send(users);
	} catch (err) {
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error
		});
	}
});

router.get('/:username', async (req, res) => {
	try {
		const user = await User.findOne({
			username: req.params.username
		});
		if (!user)
			return res.status(404).send({
				errorMessage: `User with username '${req.params.username}' not found.`
			});
		return res.send(user);
	} catch (error) {
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error
		});
	}
});

router.post('/', async (req, res) => {
	try {
		const { email, username } = req.body;
		const user = await User.create({
			email,
			username,
			friends: []
		});
		return res.send(user.toObject());
	} catch (error) {
		if (error.keyValue && error.keyValue.username) {
			return res.status(409).send({
				errorMessage: `Username '${error.keyValue.username}' is already in use.`,
				error
			})
		}
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error
		});
	}
});

router.post('/:username/friend/:fname', async (req, res) => {
	try {
		const { username, fname } = req.params;
		const user = await User.findOne({ username });
		const fuser = await User.findOne({ username: fname });
		if (!user)
			return res.status(404).send({
				errorMessage: `User with username '${username}' not found.`
			});
		if (!fuser)
			return res.status(404).send({
				errorMessage: `User with username '${fname}' not found.`
			});
		if (user.friends.length === 5)
			return res.status(400).send({
				errorMessage: `User with username '${username}' already has 5 friends.`
			});
		if (user.friends.includes(fname))
			return res.status(400).send({
				errorMessage: `User with username '${username}' is already friends with user '${fname}'.`
			});
		user.friends.push(fname);
		await User.findOneAndUpdate({ username }, user);
		return res.send(user);
	} catch (err) {
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error
		});
	}
});

router.put('/:username', async (req, res) => {
	try {
		const { email, username } = req.body;
		const user = await User.findOneAndUpdate({ username: req.params.username }, {
			email,
			username,
			friends: []
		});
		if (!user) {
			res.status(404).send({
				errorMessage: `User with username '${req.params.username}' does not exist.`
			});
		}
		return res.send({
			email,
			username,
			friends: []
		});
	} catch (error) {
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error: error
		});
	}
});

router.delete('/:username', async (req, res) => {
	try {
		const user = await User.findOneAndDelete({ username: req.params.username });
		if (!user) {
			res.status(404).send({
				errorMessage: `User with username '${req.params.username}' does not exist.`
			});
		}
		return res.send(user.toObject());
	} catch (error) {
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error: error
		});
	}
});

router.delete('/:username/friend/:fname', async (req, res) => {
	try {
		const { username, fname } = req.params;
		const user = await User.findOne({ username });
		if (!user)
			return res.status(404).send({
				errorMessage: `User with username '${username}' not found.`
			});
		if (!user.friends.includes(fname))
			return res.status(400).send({
				errorMessage: `User with username '${username}' is not friends with user '${fname}'.`
			});
		user.friends = user.friends.filter(f => f !== fname);
		await User.findOneAndUpdate({ username }, user);
		return res.send(user);
	} catch (err) {
		return res.status(500).send({
			errorMessage: 'An internal server error has occured.',
			error
		});
	}
});

module.exports = router;
