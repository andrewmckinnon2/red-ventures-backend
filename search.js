$(document).ready(() => {
    $("#submitbutton").on("click", () => {
        console.log("loaded search.js");
        search();
    });
    $("#primepic").on("click", () => {
        searchByPlatform("prime");
    });
    $("#hbopic").on("click", () => {
        searchByPlatform("hbo");
    });
    $("#netflixpic").on("click", () => {
        searchByPlatform("netflix");
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
        return result;
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
        
        let plats = [];
        if (platform == "prime") {
            plats.push("amazon_prime");
        } else if (platform == "hbo") {
            plats.push("hbo");
        } else if (platform == "netflix") {
            plats.push("netflix")
        } 

        const result = await axios({
            method: 'get',
            url: URL + 'search/',
            params: {
                rating: null,
                language: null,
                streamingPlatforms: plats, 
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