$(document).ready(() => {
    $("#submitbutton").on("click", () => {
        console.log("loaded search.js");
        
        console.log(search().then(function(result) {
            console.log(result.data.results);
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
            // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
            // localStorage.removeItem("")
        }).catch(function(problem) {
            console.log(problem);
        }));
    });
    $("#primepic").on("click", () => {
        console.log(searchByPlatform("amazon_prime").then(function(result) {
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
        // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
        }).catch(function(problem) {
            console.log(problem);
        }));
    });
    $("#hbopic").on("click", () => {
        console.log(searchByPlatform("hbo").then(function(result) {
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
        // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
        }).catch(function(problem) {
            console.log(problem);
        }));

    });
    $("#netflixpic").on("click", () => {
        console.log(searchByPlatform("netflix").then(function(result) {
            localStorage.setItem('search_results', JSON.stringify(result.data.results));
            
        // makeMovieTiles(result.data.results);
            window.location = "./search_results.html";
        }).catch(function(problem) {
            console.log(problem);
        }));

    });
}); 

async function search() {
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
        
        if ($("#netflixcheck").prop("checked") == true) {
            plats.push("netflix");
        } 
        if ($("#hbocheck").prop("checked") == true) {
            plats.push("hbo");
        } 
        if ($("#primecheck").prop("checked") == true) {
            plats.push("amazon_prime");
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

async function searchByPlatform(platform) {
    try {
        var URL;
        if (isProd) {
            URL = prodURL;
        } else {
            URL = devURL;
        }

        const result = await axios({
            method: 'get',
            url: URL + 'search/',
            params: {
                rating: null,
                language: null,
                streamingPlatforms: platform, 
                searchString: null,
                sorting: null
            }
        });
        console.log('axios request should have been sent');
        return result;
    } catch (error) {
        return error;
    }
}


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

