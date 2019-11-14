$(document).ready(() => {
    $("#analyticsbutton").on("click", () => {
        getAnalytics();
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
        return result;
    } catch (error) {
        return error;
    }
}