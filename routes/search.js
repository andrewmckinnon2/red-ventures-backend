const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res, next) => {
    console.log("inside of search.js");

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
    console.log("result of database query:");
    console.log(result);

    //get movie search results from their api
    let movieSearchResults;
    try{
        movieSearchResults = await axios.get(config.getMoviesUrl);
        movieSearchResults = movieSearchResults.data;
    } catch(e) {
        console.log("error occurred:");
        console.log(e);
        res.status(500).json({
            message: 'error encountered'
        })
        next();
    }

    //get show search results from their api
    let showSearchResults;
    try{
        showSearchResults = await axios.get(config.getShowsUrl);
        showSearchResults = showSearchResults.data;
    } catch(e) {
        console.log("error occurred:");
        console.log(e);
        res.status(500).json({
            message: 'error encountered'
        })
        next();
    }


    let showsAndMovies = movieSearchResults.concat(showSearchResults);

    searchResults = showsAndMovies.filter((content) => {
        //filter by rating
        if(rating != null && content.rating && ('rating' in content) && content.rating != rating){ return false; }
        //filter by language
        if(language != null && ('original_language' in content) && content.original_language && content.original_language.localeCompare(language) != 0){ return false; }
        //filter by title
        if(('title' in content) && !content.title.includes(searchString)){ return false; }
        //filter by streaming platform 
        if(streamingPlatforms && streamingPlatforms.length != 0 && ('streaming_platform' in content)){
            let foundStreamingPlatform = false;
            for(let i = 0; i < streamingPlatforms.length; i++){
                for(let j = 0; j < content.streaming_platform.length; j++){
                    if(streamingPlatforms[i] == content.streaming_platform[j]){
                        foundStreamingPlatform = true;
                    }
                }
            }
            if(!foundStreamingPlatform) { return false; }
        }
        return true;
    })

    //get from database all avg ratings
    let searchResultsReadQuery = "SELECT review_imdb_key, AVG(review_rating) AS avg_campus_score FROM reviews GROUP BY review_imdb_key"
    let ourReviews;
    try{
        ourReviews = await database.query(searchResultsReadQuery);
        ourReviews = ourReviews.rows;
    } catch(e) {
        console.log("error encountered:");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
        next();
    }

    imdbKeyToRating = {}
    ourReviews.forEach(row => imdbKeyToRating[row.review_imdb_key] = row.avg_campus_score);

    cleanedSearchResults = [];
    for(let i=0; i < searchResults.length; i++){
        let imdb_key = null;
        let title = null;
        let platforms = null;
        let rating = null;
        let popularity = null;
        let imdb_rating = null;

        if('imdb' in searchResults[i]){
            imdb_key = searchResults[i].imdb;
        }

        if('title' in searchResults[i]){
            title = searchResults[i].title;
        }

        if('streaming_platform' in searchResults[i]){
            platforms = searchResults[i].streaming_platform;
        }

        if('rating' in searchResults[i]){
            rating = searchResults[i].rating;
        }

        if('popularity' in searchResults[i]){
            popularity = searchResults[i].popularity;
        }

        if('vote_average' in searchResults[i]){
            imdb_rating = searchResults[i].vote_average
        }

        if('original_language' in searchResults[i]){
            language = searchResults[i].original_language;
        }

        modifiedMovie = {
            'imdb_key': imdb_key,
            'title': title,
            'platforms': platforms,
            'rating': rating,
            'popularity': popularity,
            'imdb_rating': imdb_rating,
            'language' : language
        }

        if(imdb_key in imdbKeyToRating){
            modifiedMovie[constants.RESPONSE_KEYS.OUR_REVIEWS] = imdbKeyToRating[searchResults[i].imdb];
        } else {
            modifiedMovie[constants.RESPONSE_KEYS.OUR_REVIEWS] = null;
        }
        cleanedSearchResults.push(JSON.stringify(modifiedMovie));
    }


    res.status(200).json({
        results: cleanedSearchResults
    })

})

module.exports = router;