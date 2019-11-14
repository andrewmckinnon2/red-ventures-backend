const express = require('express');
const Database = require('../db');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

//api endpoint for analytics on the platform requested
router.get('/', async (req, res) => {
    console.log("inside of platform-analytics handler");

    //parse out param
    let streamingPlatform = req.body.streaming_platform;

    let database = new Database(config.database);

    /**
     * Query that will perform the following:
     * From platforms table - get banner clicks
     * From reviews - get number of reviews where the platform_watched is equal to streamingPlatform
     * Join on movies, shows, streaming_to_imdb, to get clicks for the platform as a whole
     * Join on movies, shows, streaming_to_imdb, reviews to get avg rating for the movies across platform
     */

     //get banner clicks per platform
     let bannerClicksPerPlatformReadQuery = "SELECT platform_name, platform_banner_clicks FROM streaming_platforms_banner GROUP BY platform_name";
     let bannerClicksPerPlatform;
     try{
         bannerClicksPerPlatform = await database.query(bannerClicksPerPlatformReadQuery);
         bannerClicksPerPlatform = bannerClicksPerPlatform.rows;
     } catch(e) {
         console.log("error encountered:");
         console.log(e);
         res.status(500).json({
             message: "error encountered"
         })
     }


     //get reviews per platform
     let reviewsPerPlatformReadQuery = "SELECT S.stream_platform_imdb AS `platform`, COUNT(*) AS `num_reviews` FROM reviews R, streaming_to_imdb S WHERE R.review_imdb_key = S.imdb_key_stream GROUP BY S.stream_platform_imdb";
     let reviewsPerPlatform;
     try{
         reviewsPerPlatform = await database.query(reviewsPerPlatformReadQuery);
         reviewsPerPlatform = reviewsPerPlatform.rows;
     } catch(e) {
         console.log("error encountered:");
         console.log(e);
         res.status(500).json({
             message: "error encountered"
         })
     }

     //get total clicks per platform
     let totalClicksPerPlatformReadQuery = "Select s_movie.platform, ((s_movie.movie_clicks) + (s_show.show_clicks) ) AS total_clicks FROM (SELECT stream_platform_imdb AS platform, sum(movie_clicks) AS movie_clicks" +
     " FROM test.movies, test.streaming_to_imdb WHERE movie_imdb_key = imdb_key_stream GROUP BY stream_platform_imdb ) AS s_movie, (SELECT stream_platform_imdb AS platform, sum(show_clicks) AS show_clicks" +
     " FROM test.shows, test.streaming_to_imdb WHERE show_imdb_key = imdb_key_stream GROUP BY stream_platform_imdb ) AS s_show WHERE s_show.platform = s_movie.platform";
     let totalClicksPerPlatform;
     try{
         totalClicksPerPlatform = await database.query(totalClicksPerPlatformReadQuery);
         totalClicksPerPlatform = totalClicksPerPlatform.rows;
     } catch(e) {
         console.log("error encountered:");
         console.log(e);
         res.status(500).json({
             message: "error encountered"
         })
     }

     //get avg score per platform
     let avgScorePerPlatformReadQuery = "SELECT stream_platform_imdb AS `platform`, AVG(review_rating) AS `score_per_platform` FROM reviews, movies, shows, streaming_to_imdb" +
     " WHERE movie_imdb_key = (imdb_key_stream OR show_imdb_key = imdb_key_stream) AND review_imdb_key = imdb_key_stream GROUP BY stream_platform_imdb";
     let avgScorePerPlatform;
     try{
         avgScorePerPlatform = await database.query(avgScorePerPlatformReadQuery);
         avgScorePerPlatform = avgScorePerPlatform.rows;
     } catch(e) {
         console.log("error encountered:");
         console.log(e);
         res.status(500).json({
             message: "error encountered"
         })
     }

     //get searches per language
     let searchesPerLanguageReadQuery = "SELECT language, COUNT(*) AS `num_searches` FROM searches GROUP BY `language`";
     let searchesPerLanguage;
     try{
         searchesPerLanguage = await database.query(searchesPerLanguageReadQuery);
         searchesPerLanguage = searchesPerLanguage.rows;
     } catch(e) {
         console.log("error encountered:");
         console.log(e);
         res.status(500).json({
             message: "error encountered"
         })
     }
     
     //get searches per rating
     let searchesPerRatingReadQuery = "SELECT search_rating, COUNT(*) AS `num_searches` FROM searches GROUP BY `search_rating`";
     let searchesPerRating;
     try{
         searchesPerRating = await database.query(searchesPerRatingReadQuery);
         searchesPerRating = searchesPerRating.rows;
     } catch(e) {
         console.log("error encountered:");
         console.log(e);
         res.status(500).json({
             message: "error encountered"
         })
     }

     //put results into usable json object
     let responseObject = {
         banner_clicks_per_platform: {
             'netflix': null,
             'hbo': null,
             'amazon_prime': null
         },
         reviews_per_platform: {
             'netflix': null,
             'hbo': null,
             'amazon_prime': null
         },
         total_clicks_per_platform: {
             'netflix': null,
             'hbo': null,
             'amazon_prime': null
         },
         score_per_platform: {
             'netflix': null,
             'hbo': null,
             'amazon_prime': null
         },
         searches_per_language: {
             'en': null,
             'de': null,
             'es': null,
             'fr': null,
             'ko': null,
             'hi': null
         },
         searches_per_rating: {
             'NR': null,
             'R': null,
             'PG-13': null,
             'PG': null
         }
     }

     bannerClicksPerPlatform.forEach((row) => {
         responseObject.banner_clicks_per_platform[row.platform_name] = row.platform_banner_clicks;
     });

     reviewsPerPlatform.forEach((row) => {
         responseObject.reviews_per_platform[row.platform] = row.num_reviews;
     });

     totalClicksPerPlatform.forEach((row) => {
         responseObject.total_clicks_per_platform[row.platform] = row.total_clicks;
     })

     avgScorePerPlatform.forEach((row) => {
         responseObject.score_per_platform[row.platform] = row.score_per_platform;
     })

     searchesPerLanguage.forEach((row) => {
         responseObject.searches_per_language[row.language] = row.num_searches;
     })

     searchesPerRating.forEach((row) => {
         responseObject.searches_per_rating[row.search_rating] = row.num_searches;
     })

     console.log('responseObject after processing:');
     console.log(responseObject);
     res.status(200).json({
         results: responseObject
     })

})

module.exports = router;