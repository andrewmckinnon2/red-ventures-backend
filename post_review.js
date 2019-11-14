$(document).ready(() => {
    $("#reviewsubmit").on("click", () => {
        console.log("loaded post_review.js");
        review();

        location.reload(); 
    });
});

async function review() {
    try {
        var URL;
        if (isProd) {
            URL = prodURL;
        } else {
            URL = devURL;
        }
        let rev = $("#review").val();
        let eml = $("#email").val();
        let schl = $("#school").val();
        let rat = $("#slider").val();
        let plat = $("#reviewplatform").val();
        let id = localStorage.getItem('clicked_movie').substring(1,);
        //let id = $("#")

        // movie_idb_key, email, school, platform, review
        
        console.log('inside of try block w/ axios request');
        const result = await axios({
            method: 'post',
            url: URL + 'review/',
            params: {
                movie_imdb_key: id,
                email: eml,
                school: schl, 
                platform: plat,
                review: rev,
                rating: rat,
            }
        });
        console.log('axios request should have been sent');
        return result;
    } catch (error) {
        console.log("error :(");
        return error;
    }
}