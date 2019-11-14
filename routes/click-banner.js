const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for banner clicks
router.put('/', async (req, res) => {
    console.log("click-banner request recieved");
    
    //parse out request param
    let platform = req.query.platform;

    let database = new Database(config.database);

    //write click to database
    let streamingPlatformBannerWriteQuery = 'UPDATE streaming_platforms_banner SET platform_banner_clicks = platform_banner_clicks + 1 WHERE  platform_name = ?'

    try{
        await database.query(streamingPlatformBannerWriteQuery, [platform]);
    } catch(e) {
        console.log("error encountered:");
        console.log(e);
        res.status(500).json({
            message: "error encountered"
        })
    }

    //successful response 
    res.status(200).json({
        message: "success"
    })
})

module.exports = router;