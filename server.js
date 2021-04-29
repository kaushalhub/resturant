const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors')
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path : './config/config.env' });

const app = express();

// Allow Access
app.use(cors())

// Connect DB
connectDB();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Import Routes
const hotels = require('./routes/hotel');


// Use Routes
app.use('/api/v1/hotels', hotels)

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is running on ${PORT}`))