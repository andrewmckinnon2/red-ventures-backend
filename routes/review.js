const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for movie searches
router.post('/', async (req, res) => {

    //parse out parts of the request
    let movieIdbKey = req.query.movie_idb_key;
    let email = req.query.email;
    let school = req.query.school;
    let platform = req.query.platform;
    let review = req.query.review;

    let database = new Database(config.database);

    //write review to review table

    //send back success code

})

module.exports = router;