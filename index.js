const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

const searchRouter = require('./routes/search');
const clickBannerRouter = require('./routes/click-banner');
const movieRouter = require('./routes/movie');
const reviewRouter = require('./routes/review');
const platformAnalyticsRouter = require('./routes/platform-analytics');


app.use('/search', searchRouter);
app.use('/click-banner', clickBannerRouter);
app.use('/movie', movieRouter);
app.use('/review', reviewRouter);
app.use('/streaming-platform-analytics', platformAnalyticsRouter);


//serve front end code
app.use('/static', express.static('public'));


var serverPort = 3000;
var serverIpAddress = '127.0.0.1';

app.listen(serverPort, serverIpAddress, function(){
    console.log( "Listening on " + serverIpAddress + ", port " + serverPort )
});

module.exports = app;