const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

const router = express.Router();

//api endpoint for movie searches
router.post('/', async (req, res) => {

    //parse out parts of the request
    let movieIdbKey = req.query.movie_imdb_key;
    let email = req.query.email;
    let school = req.query.school;
    let platform = constants.PLATFORM_MAPPINGS[req.query.platform];
    let review = req.query.review;
    let rating = req.query.rating;

    console.log("review request recieved");

    let database = new Database(config.database);

    //write review to review table
    let reviewWriteQuery = 'INSERT INTO reviews (`email`, `school`, `platform_watched`, `review`, `review_rating`, `review_imdb_key`) VALUES(?, ?, ?, ?, ?, ?)'
    let queryParams = [email, school, platform, review, rating, movieIdbKey];

    try{
        await database.query(reviewWriteQuery, queryParams);
    } catch(e) {
        console.log("encountered error");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
    }
    //send back success code
    res.status(200).json({
        message: "success"
    })
})

module.exports = router;