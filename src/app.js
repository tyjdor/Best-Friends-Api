require('dotenv').config();
require('./db');

const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/', require('./controller/home'));
app.use('/user', require('./controller/user'));
app.use('/notification', require('./controller/notification'));

app.listen(PORT, () => console.log(`Express server listenting on port ${PORT}...`));
