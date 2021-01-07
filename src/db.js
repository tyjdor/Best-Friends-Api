const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
	.then(() => console.log('Connected to DB...'))
	.catch(() => console.error('Error connecting to DB...'));
