const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res) => {

    //parse out parts of the request
    let rating = req.body.rating; //rating - pg-13, R, etc.
    let language = req.body.language; //language - english, korean, hindi
    let streamingPlatforms = req.body.streaming; //array of hbo, netflix, amazon prime
    let searchString = req.body.searchString; //actual string entered by the user
    let sorting = req.body.sorting; //either popularity or IMDB rating

    //languages are encoded as en, ko, hi

    let database = new Database(config.database);

    console.log("inside of search request handler");

    //write to database the search

    //get from database the ratings associated with our platform

    //get results from their api
    axios.get(config.getMoviesUrl)
    .then(response => {
        //filter out by rating
        if(rating){

        }
    }).catch(error => {
        console.log("error:");
        console.log(error);
    })
})

module.exports = router;