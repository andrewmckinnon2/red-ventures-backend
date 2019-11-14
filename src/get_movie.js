// $(document).ready(() => {
//     $(".movietile").on("click", (event) => {
//         console.log(event.target.id);
//         getMovie();
//     })
// });

// green lantern is reviewed

async function getMovie() {
    let id = localStorage.getItem('clicked_movie').substring(1,);
    console.log("id:" + id);

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
                imdb_id: id,
            }
        });
        console.log('axios request should have been sent');
        return result;
    } catch (error) {
        return error;
    }
}

getMovie().then((result) => {
    // populate the movie info
    console.log("after getMovie, here's result: " + result);
    let data = result.data.results;

    let platformstring = "";
    let last = false;
    for (let j = 0; j < data.platforms.length; j++){
        if (j == data.platforms.length - 1) {
            last = true;
        }
        if (!last) {
            if (data.platforms[j] == "netflix") {
                platformstring += "Netflix, "
            } else if (data.platforms[j] == "hbo") {
                platformstring += "HBO, "
            } else if (data.platforms[j] == "amazon_prime") {
                platformstring += "Amazon Prime, "
            } else {
                platformstring = "NA";
                break;
            }
        } else {
            if (data.platforms[j] == "netflix") {
                platformstring += "Netflix"
            } else if (data.platforms[j] == "hbo") {
                platformstring += "HBO"
            } else if (data.platforms[j] == "amazon_prime") {
                platformstring += "Amazon Prime"
            } else {
                platformstring = "NA";
                break;
            }
        }
        
    }

    let prod_co_string = "";
    last = false;
    for (let i = 0; i < data.production_comps.length; i++) {
        if (i == data.production_comps.length - 1) {
            last = true;
        }
        if (!last) {
            prod_co_string += data.production_comps[i] + ", ";
        } else {
            prod_co_string += data.production_comps[i];
        }
    }
    let html = `<h1 class="is-large">${data.title}</h1>
    <h4 class="is-medium">Available on: ${platformstring}</h4>
    <p><strong>Summary </strong>${data.summary}</p>
    <p><strong>Production Companies </strong>${prod_co_string}</p>
    <p><strong>Rating </strong>${data.rating}</p>
    <p><strong>Popularity </strong> <progress class="progress is-info" value="${data.popularity}" max="80"></progress> </p>`;
    $('#movie_info').html(html);
    

    // populate reviews
    if (data.reviews == null || data.reviews == undefined || data.reviews.length == 0) {
        $("#reviews").html("<h1>Not reviewed yet...be the first!</h1>");
    } else {
        for (let i = 0; i < data.reviews.length; i++) {
            // {written_review, school, rating}
            let review = data.reviews[i];
            if (review.written_review == null) {
                continue;
            }
            let reviewhtml = `<div class="box">
            <article>
            <p>Review from <strong>${review.school}</strong></p>
            <p><small>${review.written_review}</small></p>
            <p><small>Rating: ${review.rating}/10</small></p>
            </article>
            </div>`;
            $("#reviews").append(reviewhtml);
        }
    }
    // localStorage.removeItem('clicked_movie');
    
}).catch((problem) => {
    console.log(problem);
});
