const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.get('/', async (req, res) => {

    //parse out parts of the request
    let imdbId = req.query.imdb_id;
    console.log('imdbId: ' + imdbId);

    let database = new Database(config.database);

    //write to db to increment movie_clicks in movie table
    let movieClicksWriteQuery = 'UPDATE movies SET movie_clicks=movie_clicks+1 WHERE movie_imdb_key=?'

    try{
        await database.query(movieClicksWriteQuery, [imdbId]);
    } catch(e) {
        console.log("error encountered:");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
    }

    //get movie information for this movie from RV api
    let showResult;
    try{
        showResult = await axios.get(config.getMoviesUrl + "/" + imdbId);
    } catch(e) {
        console.log("error encountered:");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
    }

    if(showResult.data != ''){
        try{
            showResult = await axios.get(config.getShowsUrl + "/" + imdbId);
        } catch(e) {
            console.log("error encountered:");
            console.log(e);
            res.status(500).json({
                message: "error encountered"
            })
        }
    }

    
    

    //get from database all the reviews associated with this movie

})

module.exports = router;