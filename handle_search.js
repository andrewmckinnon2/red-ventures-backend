function makeMovieTiles() {
    let results = JSON.parse(localStorage.getItem('search_results'));
    console.log(results);
    // console.log("typeof(JSON.parse(results))")
    // // console.log(typeof(JSON.parse(results)));
    // console.log(typeof(results));
    // console.log(typeof(localStorage[0]));
    $("#tileboard").empty();
    if (results == null || results == undefined || results.length == 0) {
        let errormsg = `<h1 class="is-centered">No results :(</h1>`
        $("#tileboard").append(errormsg);
    } else {
        
        for (let i = 0; i < results.length; i++) {
            let obj = JSON.parse(results[i]);
            let platformstring = "";
            for (let j = 0; j < obj.platforms.length; j++){
                if (obj.platforms[j] == "netflix") {
                    platformstring += "Netflix\n"
                } else if (obj.platforms[j] == "hbo") {
                    platformstring += "HBO\n"
                } else if (obj.platforms[j] == "amazon_prime") {
                    platformstring += "Amazon Prime\n"
                } else {
                    platformstring = "NA";
                    break;
                }
            }

            let noreviewormaybethereisone = ""
            if (obj.college_review == null) {
                noreviewormaybethereisone = "NA";
            } else {
                noreviewormaybethereisone = obj.college_review;
            }

            let html = `<div class="tile column is-one-third movietile is-parent">
                <article id="${obj.imdb_key}" class="tile is-child notification ">
                    <p class="title">${obj.title}</p>
                    <p class="subtitle">Available on: <span>${platformstring}</span></p>
                    <p>Our rating: ${noreviewormaybethereisone}</p>
                </article>
                </div>`
            $("#tileboard").append(html);
    
            let tileid = "#" + obj.imdb_key;
            $(tileid).on("click", () => {
                window.location = "./movie.html";
            });
        }
    }
    localStorage.removeItem('search_results');
    
}

//<p>Language: ${obj.language}</p>

makeMovieTiles();
// loop through all movie panels and add click handlers