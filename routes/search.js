const express = require('express');


const router = express.Router();

//api endpoint for movie searches
router.post('/', async (req, res) => {

    //parse out parts of the request
    /*
    Params: Genre, Rating (R, PG-13, etc, y’all know ratings), Language (original language), Production platform, Streaming platform, Ppl on my campus who have watched/reviewed ?? Maybe
    */
    let rating = req.body.rating;
    let language = req.body.language;
    let streamingPlatform = req.body.streaming;
    let searchString = req.body.searchString;
    let sorting = req.body.sorting;

    
})