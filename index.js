const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);



var serverPort = 3000;
var serverIpAddress = '127.0.0.1';

app.listen(serverPort, serverIpAddress, function(){
    console.log( "Listening on " + serverIpAddress + ", port " + serverPort )
});

module.exports = app;