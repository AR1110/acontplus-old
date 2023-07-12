function showLoader() {
    var div = "<div class='loading'><span class='spinner'></span></div>"
    $('#loaderCss').html(div);
    $('#loaderCss').addClass('positionLoading');
}

function hideLoader() {
    $('.loading').remove();
    $('#loaderCss').removeClass('positionLoading');
}