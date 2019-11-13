const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res) => {

    //parse out parts of the request
    let rating = req.query.rating; //rating - pg-13, R, etc.
    let language = req.query.language; //language - english, korean, hindi
    let streamingPlatforms = req.query.streamingPlatforms; //array of hbo, netflix, amazon prime
    let searchString = req.query.searchString; //actual string entered by the user
    let sorting = req.query.sorting; //either popularity or IMDB rating

    res.status(200).json({
        message: "success",
    });

    //languages are encoded as en, ko, hi

    let database = new Database(config.database);

    console.log("inside of search request handler");

    //write to database the search
    let searchTableWriteQuery = "INSERT INTO `searches` (`search_rating`, `language`, `sort_by`, `search_text`)" +
                                "VALUES(?, ?, ?, ?)"
    let searchTableWriteParams = [rating, language, sorting, searchString];
    let result;
    try{
        result = await database.query(searchTableWriteQuery, searchTableWriteParams);
    } catch(e) {
        console.log("error encountered");
        console.log(e);
        res.status(500).json({
            message: 'error encountered',
        })
    }
    console.log("result of database insertion:");
    console.log(result);

    //get results from their api
    axios.get(config.getMoviesUrl)
    .then(response => {
        moviesAndShows = response.data;
        filteredData = response.filter((content) => {
            if(rating && content.rating != rating){ return false; }
            if(language && content.language != language){ return false; }
            if(!content.title.includes(searchString)){ return false; }
            if(streamingPlatforms && streamingPlatforms.length != 0){
                let foundStreamingPlatform = false;
                for(let i = 0; i < streamingPlatforms.length; i++){
                    for(let j = 0; j < moviesAndShows.length; j++){
                        if(streamingPlatforms[i] == moviesAndShows[j]){
                            foundStreamingPlatform = true;
                        }
                    }
                }
                if(!foundStreamingPlatform) { return false; }
            }

            return true;
        });

        //filter by search string
        

        //filter by streaming platforms
    }).catch(error => {
        console.log("error:");
        console.log(error);
    })

    //get from database the ratings associated with our platform
    let searchResultsReadQuery = "SELECT AVG(R.review_rating) FROM test.reviews as R WHERE review_imdb_key = ? GROUP BY review_imdb_key";



})

module.exports = router;