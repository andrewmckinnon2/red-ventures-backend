$(document).ready(() => {
    $(".movietile").on("click", () => {
        getMovie();
    })
});

async function getMovie() {
    try {
        var URL;
        if (isProd) {
            URL = prodURL;
        } else {
            URL = devURL;
        }
        
        console.log('inside of try block w/ axios request');
        const result = await axios({
            method: 'get',
            url: URL + 'movie/',
            params: {
                imdb_id: 'tt0110912',
            }
        });
        console.log('axios request should have been sent');
        return result;
    } catch (error) {
        return error;
    }
}