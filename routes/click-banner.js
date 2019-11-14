const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for banner clicks
router.put('/', async (req, res) => {
    console.log("request recieved");
    
    //parse out request param
    let platform = req.body.platform;

    let database = new Database(config.database);

    //write click to database

    //get from database the ratings associated with this platform

    //get results from RV api
    axios.get(config.getMoviesUrl)
    .then(response => {

    }).catch(error => {
        console.log("error:");
        console.log(error);
    })
})

module.exports = router;