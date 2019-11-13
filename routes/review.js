const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.post('/', async (req, res) => {

    //parse out parts of the request
    Params: movie_idb_key, email, school, platform, review
    let movieIdbKey = req.body.movie_idb_key;
    let email = req.body.email;
    let school = req.body.school;
    let platform = req.body.platform;
    let review = req.body.review;

    let database = new Database(config.database);

    //write review to review table

    //send back success code

})

module.exports = router;