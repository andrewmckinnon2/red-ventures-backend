const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for analytics on the platform requested
router.get('/', async (req, res) => {

    //parse out param
    let streamingPlatform = req.body.streaming_platform;

    let database = new Database(config.database);

    /**
     * Query that will perform the following:
     * From platforms table - get banner clicks
     * From reviews - get number of reviews where the platform_watched is equal to streamingPlatform
     * Join on movies, shows, streaming_to_imdb, to get clicks for the platform as a whole
     * Join on movies, shows, streaming_to_imdb, reviews to get avg rating for the movies across platform
     */

    //get results from their api
    axios.get(config.getMoviesUrl)
    .then(response => {
        //filter out by rating
        if(rating){

        }
    }).catch(error => {
        console.log("error:");
        console.log(error);
        //send error response to client
    })
})

module.exports = router;