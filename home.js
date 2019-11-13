$(document).ready(() => {
    
    $("#primepic").on('click', () => {
        window.location = "search_results.html";
        bannerClick("amazon_prime");
    });
    $("#netflixpic").on('click', () => {
        window.location = "search_results.html";
        bannerClick("netflix");
    });
    $("#hbopic").on('click', () => {
        window.location = "search_results.html";
        bannerClick("hbo");
    });
}); 

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