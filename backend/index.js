const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const db = require('./config/db');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const classRoute = require('./routes/class');

const app = express();
dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

db.connect();

//ROUTES
app.use(bodyParser.json()) ;
app.use('/v1/auth',authRoute);
app.use('/v1/user',userRoute);
app.use('/v1/class',classRoute);

app.listen(3000,() =>{
    console.log('server is running')
})