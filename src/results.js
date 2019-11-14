let updateSlider = () => {
    let value = $("#slider").val();
    $("#current").empty().html(value);
}

$(document).ready(() => {
    $("#slider").on('input', () => {updateSlider();});
}); 

