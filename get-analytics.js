var darkBlue = "#033c59";
var lightOrange = "#fb9236";
var grey = "#424953";
var teel = "#46847f";

$(document).ready(() => {
    getAnalytics();
    $("#analyticsbutton").on("click", () => {
        //do nothing, already on the analytics page
    });
    $("#clicktab").on("click", () => {
        $("#clicktab").addClass("is-active");
        $("#clickcharts").removeClass("noshow");

        $("#searchcharts").addClass("noshow");
        $("#searchtab").removeClass("is-active");

        $("#reviewcharts").addClass("noshow");
        $("#reviewtab").removeClass("is-active");
    });

    $("#searchtab").on("click", () => {
        $("#searchtab").addClass("is-active");
        $("#searchcharts").removeClass("noshow");

        $("#clickcharts").addClass("noshow");
        $("#clicktab").removeClass("is-active");

        $("#reviewcharts").addClass("noshow");
        $("#reviewtab").removeClass("is-active");
    });

    $("#reviewtab").on("click", () => {
        $("#reviewtab").addClass("is-active");
        $("#reviewcharts").removeClass("noshow");

        $("#searchcharts").addClass("noshow");
        $("#searchtab").removeClass("is-active");

        $("#clickcharts").addClass("noshow");
        $("#clicktab").removeClass("is-active");
    });
});


async function getAnalytics() {
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
            url: URL + 'streaming-platform-analytics/',
        });
        console.log('axios request should have been sent');
        console.log("result of get-analytics request:");

        //create pie charts for banner clicks per platform and for total clicks per platform
        
        //create pie chart for banner clicks
        drawPlatformChart(result.data.results.banner_clicks_per_platform, "bannerClicksPieChart", "Banner Clicks Per Platform");

        //create pie chart for total clicks
        drawPlatformChart(result.data.results.total_clicks_per_platform, "totalCliksPerPlatform", "Content Clicks Per Platform");

        //create bar chart for language searches
        drawLanguagesSearchesChart(result.data.results.searches_per_language, "searchesPerLanguageColChart", "Searches by Language");

        //create bar chart for rating searches
        drawRatingsSearchesChart(result.data.results.reviews_per_platform, "searchesPerRatingColChart", "Searches by Rating");

        //create pie chart for avg ratings
        drawPlatformScoreChart(result.data.results.score_per_platform, "scorePerPlatformColChart", "Average Rating per Platform");

        //create pie chart for reviews per platform
        drawPlatformChart(result.data.results.reviews_per_platform, "reviewsPerPlatformPieChart", "Reviews Per Platform");
        console.log(result);
    } catch (error) {
        return error;
    }
}

function drawPlatformChart(platformsToCounts, targetId, chartName) {
    google.charts.load('current', {'packages':['corechart']});

    let drawPlatformChartCallback = () => {
        var data = google.visualization.arrayToDataTable([
            ['key', 'value'],
            ['Netflix', platformsToCounts.netflix],
            ['HBO', platformsToCounts.hbo],
            ['Amazon Prime', platformsToCounts.amazon_prime],
        ]);
    
        var options = {
            title: chartName
        };
    
        var chart = new google.visualization.PieChart(document.getElementById(targetId));
    
        chart.draw(data, options);
    }
    google.charts.setOnLoadCallback(drawPlatformChartCallback);
}

function drawLanguagesSearchesChart(languageToSearches, targetId, chartName) {
    google.charts.load("current", {packages:['corechart']});

    let drawLanguageSearchesChartCallback = () => {
        var data = google.visualization.arrayToDataTable([
            ["Search Option", "Count", { role: "style" } ],
            ["English", languageToSearches.en, darkBlue],
            ["German", languageToSearches.de, lightOrange],
            ["Spanish", languageToSearches.es, grey],
            ["French", languageToSearches.fr, teel],
            ["Hindi", languageToSearches.hi, darkBlue],
            ["Korean", languageToSearches.ko, lightOrange],
            ["German", languageToSearches.de, grey],
            ["No Language Selected", languageToSearches.null, teel]
        ]);

        var view = new google.visualization.DataView(data);

        var options = {
        title: chartName,
        width: 1500,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(targetId));
        chart.draw(view, options);
    }
    google.charts.setOnLoadCallback(drawLanguageSearchesChartCallback);
}

function drawRatingsSearchesChart(ratingsToSearches, targetId, chartName) {
    google.charts.load("current", {packages:['corechart']});

    let drawRatingsSearchesChartCallback = () => {
        var data = google.visualization.arrayToDataTable([
            ["Search Option", "Count", { role: "style" } ],
            ["NR", ratingsToSearches.NR, darkBlue],
            ["R", ratingsToSearches.R, lightOrange],
            ["PG-13", ratingsToSearches['PG-13'], grey],
            ["PG", ratingsToSearches.PG, teel],
            ["G", ratingsToSearches.R, darkBlue],
            ["No Rating Selected", ratingsToSearches.null, lightOrange]
        ]);

        var view = new google.visualization.DataView(data);

        var options = {
        title: chartName,
        width: 1500,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(targetId));
        chart.draw(view, options);
    }
    google.charts.setOnLoadCallback(drawRatingsSearchesChartCallback);
}

function drawPlatformScoreChart(platformToScore, targetId, chartName) {
    google.charts.load("current", {packages:['corechart']});

    let drawPlatformScoreChartCallback = () => {
        console.log("value of parseInt amazon prime score:");
        console.log(typeof(platformToScore.amazon_prime))
        console.log("platformToScore:");
        console.log(platformToScore);
        console.log(parseInt(platformToScore.amazon_prime));

        var data = google.visualization.arrayToDataTable([
            ["Platform", "Average Rating", { role: "style" } ],
            ["Amazon", parseInt(platformToScore.amazon_prime), darkBlue],
            ["HBO", parseInt(platformToScore.hbo), lightOrange],
            ["Netflix", parseInt(platformToScore.netflix), grey],
        ]);

        var view = new google.visualization.DataView(data);

        var options = {
        title: chartName,
        width: 1500,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(targetId));
        chart.draw(view, options);
    }
    google.charts.setOnLoadCallback(drawPlatformScoreChartCallback);
}
