const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res) => {

    //parse out parts of the request
    let imdbId = req.body.imdb_id;

    let database = new Database(config.database);

    //write to db to increment movie_clicks in movie table

    //get from database all the reviews associated with this movie

    //get movie information for this movie from RV api
    axios.get(config.getMoviesUrl + "/" + imdbId)
    .then(response => {

        //join data from RV and our database to make response

    }).catch(error => {
        console.log("error:");
        console.log(error);
    })
})

module.exports = router;