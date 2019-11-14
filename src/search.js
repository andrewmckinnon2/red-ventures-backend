$(document).ready(() => {
    $("#primepic").on("click", async () => {
        await bannerClick("amazon_prime");
        console.log(search("amazon_prime").then(function(result) {
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
        // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
        }).catch(function(problem) {
            console.log(problem);
        }));
    });
    $("#hbopic").on("click", async () => {
        await bannerClick("hbo");
        console.log(search("hbo").then(function(result) {
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
        // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
        }).catch(function(problem) {
            console.log(problem);
        }));
    
    });
    $("#netflixpic").on("click", async () => {
        await bannerClick("netflix");
        console.log(search("netflix").then(function(result) {
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
        // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
        }).catch(function(problem) {
            console.log(problem);
        }));

    });
    $("#submitbutton").on("click", async () => {
        console.log("loaded search.js");
        await
        
        console.log(search("").then(function(result) {
            console.log(result.data.results);
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
            // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
            // localStorage.removeItem("")
        }).catch(function(problem) {
            console.log(problem);
        }));
    });
    
}); 

async function search(platform) {

    try {
        var URL;
        if (isProd) {
            URL = prodURL;
        } else {
            URL = devURL;
        }
        let search = $("#search_string").val();
        let rat = $("#rating").val();
        let lang = $("#language").val();
        
        let plats = [];
        
        if (platform == "") {
            if ($("#netflixcheck").prop("checked") == true) {
                plats.push("netflix");
            } 
            if ($("#hbocheck").prop("checked") == true) {
                plats.push("hbo");
            } 
            if ($("#primecheck").prop("checked") == true) {
                plats.push("amazon_prime");
            } 
        } else {
            plats.push(platform);
        }
        
        
        let sort = $("#sorting").val();

        if (rat == "Rating") {
            rat = null;
        }
        if (lang == "Language") {
            lang = null;
        }
        if (sort == "Sort by...") {
            sort = null;
        }
        
        console.log('inside of try block w/ axios request');
        
        const result = await axios({
            method: 'get',
            url: URL + 'search/',
            params: {
                rating: rat,
                language: lang,
                streamingPlatforms: plats, 
                searchString: search,
                sorting: sort
            }
        });
        console.log('axios request should have been sent');

        if (sort != null) {
            return sortJSON(result, sort);
        } else {
            return result;
        }
        
    } catch (error) {
        return error;
    }
}

// async function searchByPlatform(platform) {
//     console.log("entered searchByPlatform");
//     try {
//         var URL;
//         if (isProd) {
//             URL = prodURL;
//         } else {
//             URL = devURL;
//         }

//         const result = await axios({
//             method: 'get',
//             url: URL + 'search/',
//             params: {
//                 rating: null,
//                 language: null,
//                 streamingPlatforms: platform, 
//                 searchString: null,
//                 sorting: null
//             }
//         });
//         console.log('axios request should have been sent');
//         console.log("result after request: " + result);
//         return result;
//     } catch (error) {
//         console.log("caught");
//         return error;

//     }
// }


function sortJSON(result, condition) { // vote_average = IMDB, popularity = Popularity
    if (condition == "IMDB Rating") {
        result.data.sort(function(a, b) {
            return a.vote_average > b.vote_average;
            /* TODO: ascending or descending? */
        });   
    } else {
        result.data.sort(function(a, b) {
            return a.popularity > b.popularity;
            /* TODO: ascending or descending? */
        });
    }
    return result;
}

async function bannerClick(platform) {
    try {
        var URL;
        if (isProd) {
            URL = prodURL;
        } else {
            URL = devURL;
        }
        
        console.log('inside of try block w/ axios request');
        const result = await axios({
            method: 'put',
            url: URL + 'click-banner/',
            params: {
                platform: platform,
            }
        });
        console.log('axios request should have been sent');
        return result;
    } catch (error) {
        return error;
    }
}