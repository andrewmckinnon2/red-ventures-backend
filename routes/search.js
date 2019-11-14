const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res, next) => {

    //parse out parts of the request
    let rating = req.query.rating; //rating - pg-13, R, etc.
    let language = req.query.language; //language - english, korean, hindi
    let streamingPlatforms = req.query.streamingPlatforms; //array of hbo, netflix, amazon prime
    let searchString = req.query.searchString; //actual string entered by the user
    let sorting = req.query.sorting; //either popularity or IMDB rating

    if(language){
        language = constants.LANGUAGE_MAPPINGS[language];
    }

    //languages are encoded as en, ko, hi

    let database = new Database(config.database);

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
        next();
    }

    //get results from their api
    let searchResults = [];
    axios.get(config.getMoviesUrl)
    .then(async (response) => {
        moviesAndShows = response.data;
        
        searchResults = moviesAndShows.filter((content) => {
            //filter by rating
            if(rating && content.rating != rating){ return false; }
            //filter by language
            if(language != null && content.original_language.localeCompare(language) != 0){ return false; }
            //filter by title
            if(!content.title.includes(searchString)){ return false; }
            //filter by streaming platform 
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

        //get from database all avg ratings
        let searchResultsReadQuery = "SELECT review_imdb_key, AVG(review_rating) AS avg_campus_score FROM reviews GROUP BY review_imdb_key"
        let ourMovieReviews;
        try{
            ourMovieReviews = await database.query(searchResultsReadQuery);
        } catch(e) {
            console.log("error encountered:");
            console.log(e);
            res.status(500).json({
                message: "error encountered"
            })
            next();
        }

        //get movie reviews into usable array format
        ourMovieReviews = ourMovieReviews.rows;

        imdbKeyToRating = {}
        ourMovieReviews.forEach(row => imdbKeyToRating[row.review_imdb_key] = row.avg_campus_score);

        searchResults.map((movie) => {
            if(movie.imdb in imdbKeyToRating){
                movie[constants.RESPONSE_KEYS.OUR_REVIEWS] = imdbKeyToRating[movie.imdb];
            } else {
                movie[constants.RESPONSE_KEYS.OUR_REVIEWS] = null;
            }
            return movie;
        });
        res.status(200).json({

        })

    }).catch(error => {
        console.log("error:");
        console.log(error);
    })

})

module.exports = router;