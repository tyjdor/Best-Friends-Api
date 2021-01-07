const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
	email: {
		type: String,
		trim: true,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid')
			}
		}
	},
	username: {
		type: String,
		trim: true,
		required: true
	},
	friends: [String],
});

module.exports = User;
