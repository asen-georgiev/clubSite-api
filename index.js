const debug = require("debug")('app:startup');
const express = require("express");
const fs = require('fs');
const path = require('path');
const sendGrid = require("@sendgrid/mail");
const app = express();
const winston = require("winston");
const multer = require("multer");
require('dotenv').config();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

require('./startup/db')();
require("./startup/cors")(app);
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/validation')();





//Building the server and the port env е когато се качи вече на сървъра
//Ние не знаем какъв порт ще ни се даде
const port = process.env.PORT || 3900;
//Must "export PORT = 5000 (or whatever)" on the console so we can have PORT env. variable
const server = app.listen(port,()=> winston.info(`Listening on port ${port}`));

module.exports = server;





