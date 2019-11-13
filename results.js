let updateSlider = () => {
    let value = $("#slider").val();
    $("#current").empty().html(value);
}

$(document).ready(() => {
    $("#slider").on('input', () => {updateSlider();});
}); 

// loop through all movie panels and add click handlers