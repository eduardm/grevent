Vantano.groups = {};


$(function ($) {
    $("ol").sortable({
        connectWith: "ol",
        receive: function (event, ui) {
            var item = ui.item,
                url = item.parent().attr("data-url"),
                tablet_id = item.attr("data-id");
            $.ajax({
                method: "POST",
                url: url,
                data: {id: tablet_id}
            });
        }
    });

    $('.dd-handle a').on('mousedown', function (e) {
        e.stopPropagation();
    });


    //var els = document.getElementsByClassName("uiMediaThumb");
    //
    //var urls = [];
    //for (var i = 0; i < 196; i++) {
    //    urls.push(decodeURIComponent(els[i].href).split("src=")[1].split("&small")[0]);
    //}
    //$("body").html('<ul class="ace-thumbnails clearfix" id="slidesForPreviewContainer"></ul>');
    //
    //for (var i = 0; i < 196; i++) {
    //    $('<li><a href="#" title="" data-rel="colorbox"><img height="150" alt="150x150" src="' + urls[i] + '"/></a></li>').appendTo($("#slidesForPreviewContainer"))
    //}


});