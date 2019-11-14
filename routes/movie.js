const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res, next) => {

    //parse out parts of the request
    let imdbId = req.query.imdb_id;
    console.log('imdbId: ' + imdbId);

    let database = new Database(config.database);

    let isMovie = true;

    //get movie information for this movie from RV api
    let RVShowResult;
    try{
        RVShowResult = await axios.get(config.getMoviesUrl + "/" + imdbId);
        RVShowResult = RVShowResult.data;
    } catch(e) {
        console.log("error encountered:");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
        next();
    }
    console.log("RVShowResult after movie get");
    console.log(RVShowResult);

    if(RVShowResult == ''){
        isMovie = false;
        try{
            RVShowResult = await axios.get(config.getShowsUrl + "/" + imdbId);
            RVShowResult = RVShowResult.data;
        } catch(e) {
            console.log("error encountered:");
            console.log(e);
            res.status(500).json({
                message: "error encountered"
            })
            next();
        }
    }

    //write to db to increment movie_clicks in movie table
    if(isMovie){
        movieOrShowClicksWriteQuery = 'UPDATE movies SET movie_clicks=movie_clicks+1 WHERE movie_imdb_key=?';
    } else {
        movieOrShowClicksWriteQuery = 'UPDATE shows SET show_clicks=show_clicks+1 WHERE show_imdb_key=?';
    }

    try{
        await database.query(movieOrShowClicksWriteQuery, [imdbId]);
    } catch(e) {
        console.log("error encountered:");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
        next();
    }

    console.log("RVShowResult:");
    console.log(RVShowResult);

    //get from database all the reviews associated with this movie
    let movieOrShowReadQuery = "SELECT R.review_rating, R.school, R.platform_watched, R.review FROM reviews as R Where review_imdb_key = ?";

    let collegePlatformReviews;
    try{
        console.log("imdbId: " + imdbId);
        collegePlatformReviews = await database.query(movieOrShowReadQuery, [imdbId]);
    } catch(e) {
        console.log("error occurred:");
        console.log(e);
        res.status(500).json({
            message: "error occurred"
        })
        next();
    }

    collegePlatformReviews = collegePlatformReviews.rows;
    collegePlatformReviews = collegePlatformReviews.map((review) => {
        return {
            'written_review' : review.review,
            'school' : review.school,
            'rating' : review.review_rating
        }
    });


    let aggregateScore = 0;
    let numReviews = 0;
    let avgScore;
    collegePlatformReviews.forEach(review => {
        aggregateScore += review.rating;
        numReviews++;
    });

    if(numReviews == 0){
        avgScore = null;
    }else {
        avgScore = aggregateScore / numReviews;
    }

    /*expected response from this query:
    {imdb_key, movie_title, platforms[], college_review, imdb_rating, reviews[], summary, production_comps[], release_date, rating, popularity}
    where reviews is the following:
    {written_review, school, rating}
    */

    //object to be returned to client with necesary data
    let responseObject = {}; 
    
    //RV provided information
    let imdb_key = null; let movie_title = null; let platforms = [];
    let imdb_rating = null; let summary = null; let production_comps = null; let rating = null; let popularity = null;

    //information from our database
    let college_review = null; let reviews = [];

    if(('imdb' in RVShowResult)){
        imdb_key = RVShowResult.imdb;
    }
    if(('title' in RVShowResult)){
        movie_title = RVShowResult.title;
    }
    if(('streaming_platform' in RVShowResult)){
        platforms = RVShowResult.streaming_platform;
    }
    if(('vote_average' in RVShowResult)){
        imdb_rating = RVShowResult.vote_average;
    }
    if(('overview' in RVShowResult)){
        summary = RVShowResult.overview;
    }
    if(('production_companies' in RVShowResult)){
        production_comps = RVShowResult.production_companies;
    }
    if(('rating' in RVShowResult)){
        rating = RVShowResult.rating;
    }
    if(('popularity' in RVShowResult)){
        popularity = RVShowResult.popularity;
    }

    college_review = avgScore;
    reviews = collegePlatformReviews;

    responseObject = {
        'imdb_key' : imdb_key,
        'title': movie_title,
        'platforms' : platforms,
        'imdb_rating' : imdb_rating,
        'summary' : summary,
        'production_comps' : production_comps,
        'rating' : rating,
        'popularity' : popularity,
        'college_review' : college_review,
        'reviews' : reviews
    }

    console.log("value of responseObject after processing:");
    console.log(responseObject);

    console.log("right before res.status.json");
    res.status(200).json({
        results : responseObject
    })
})

module.exports = router;