const mongoose = require('mongoose');

const User = mongoose.model('User', {
	email: { type: String },
	name: { type: String },
	friends: [String]
});

module.exports = User;