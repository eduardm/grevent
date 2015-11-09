/**
 * Created by user on 7/2/15.
 */


Vantano.content = {
    colorboxParams: {
        rel: 'colorbox',
        reposition: true,
        scalePhotos: true,
        scrolling: false,
        previous: '<i class="ace-icon fa fa-arrow-left"></i>',
        next: '<i class="ace-icon fa fa-arrow-right"></i>',
        close: '&times;',
        current: '{current} of {total}',
        maxWidth: '100%',
        maxHeight: '100%',
        onOpen: function () {
            $overflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        },
        onClosed: function () {
            document.body.style.overflow = $overflow;
        },
        onComplete: function () {
            $.colorbox.resize();
        }
    },

    addedSlides: [],
    removedSlides: [],

    handleSlideEdit: function(el) {
        var slideId = el.id;
        if ($(el).hasClass("dz-error")) {
            $(el).removeClass("dz-error").addClass("dz-success");
            var idx = this.removedSlides.indexOf(slideId);
            if (idx > -1) {
                this.removedSlides.splice(idx,1);
            } else {
                this.addedSlides.push(slideId);
            }
        } else {
            $(el).removeClass("dz-success").addClass("dz-error");
            var idx = this.addedSlides.indexOf(slideId);
            if (idx > -1) {
                this.addedSlides.splice(idx,1);
            } else {
                this.removedSlides.push(slideId);
            }
        }
    }
}

$(function () {
    $("#contentsTable").dataTable({});
    $("#tabletsSmallTable").dataTable(
        {
            "order": [],
            "aoColumnDefs": [
                {'bSortable': false, 'aTargets': [0]}
            ],
            "bPaginate": false
        }
    );
    //var $overflow = '';


    //$('#slidesPreviewContainer [data-rel="colorbox"]').colorbox(colorbox_params);
    //let's add a custom loading icon


    $(document).one('ajaxloadstart.page', function (e) {
        $('#colorbox, #cboxOverlay').remove();
    });

    if ($("#edit_contemt_slides").length) {
        $(".presentationSlideContainer").on("click", function () {
            Vantano.content.handleSlideEdit(this);
        });

        $("#saveContentSlidesList").on("click", function(ev) {
            ev.preventDefault();
            var url = this.href;
            var data = {
                addedSlides: Vantano.content.addedSlides,
                removedSlides: Vantano.content.removedSlides
            }
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "application/json"
            }).complete(function(resp) {
                var response = JSON.parse(resp.responseText);
                window.location = response.redirectTo;
            });
        });

        $('.durationControl').ace_spinner({
            min: 2, max: 60, step: 1, on_sides: true, icon_up: 'ace-icon fa fa-plus', icon_down: 'ace-icon fa fa-minus', btn_up_class: 'btn-success', btn_down_class: 'btn-danger'
        });

        $('.durationControl').closest('.ace-spinner').on('changed.fu.spinbox', function (ev, duration) {
            var slideId = $(this).find("input").attr("id").split("_")[1];
            Vantano.slides.updateElementDuration(slideId, parseInt(duration));
            $("#slidePreviewDuration_" + slideId).text(duration);
        });

        $("#saveContentSlidesOrderAndDuration").on("click", function(ev) {
            ev.preventDefault();
            var spinner = Vantano.utils.showSpinner(document.getElementById('edit_contemt_slides'));
            var url = this.href;
            var data = {
                slides: Vantano.slides.selectedSlides,
                order: Vantano.slides.selectedSlidesOrder
            }
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "application/json"
            }).complete(function(resp) {
                var response = JSON.parse(resp.responseText);
                window.location = response.redirectTo;
            });
        });
    }
});