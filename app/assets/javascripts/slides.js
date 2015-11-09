Vantano.slides = {
    selectedSlidesOrder: [],
    selectedSlides: {},
    noOfSlides: 0,
    duration: 0,
    size: 0,

    init: function () {
        this.noOfSlidesContainer = $("#pNoOfSlides");
        this.durationContainer = $("#pDurationOfSlides");
        this.sizeContainer = $("#pSizeOfSlides");
        this.saveUrl = $("#slideSaveUrl").text();
    },

    handleSlideSelection: function (el) {
        var slideId = el.id;
        var hiddenSlidesContainer = $("#slidesForOrderContainer");
        var slidesContainer = $("#presentationSlidesOrderContainer");
        var slidesForPreviewContainer = $("#slidesForPreviewContainer");
        var slidesPreviewContainer = $("#slidesPreviewContainer");
        var slide = $("#forOrder_" + slideId);
        var slidePreview = $("#slidePreview_" + slideId).detach();
        if ($(el).hasClass("dz-error")) {
            $(el).removeClass("dz-error").addClass("dz-success");
            this.selectedSlidesOrder.push(slideId);
            this.noOfSlides++;
            slidesContainer.append(slide);
            slidesPreviewContainer.append(slidePreview);
            var duration = 10, durationEl = $("#" + slideId + "_duration");
            if (durationEl.length) {
                duration = Math.ceil(parseFloat(durationEl.text()));
            }
            $("#slidePreviewDuration_" + slideId).text(duration);
            this.selectedSlides[slideId] = {
                duration: duration,
                size: parseFloat($("#" + slideId + "_size").text())
            };
            this._updateNoOfSlides();
            this._updateSizeAndDuration();
        } else {
            slidesForPreviewContainer.append(slidePreview);
            $(el).removeClass("dz-success").addClass("dz-error");
            this.selectedSlidesOrder = jQuery.grep(this.selectedSlidesOrder, function (value) {
                return value != slideId;
            });
            this.noOfSlides--;
            hiddenSlidesContainer.append(slide);
            delete this.selectedSlides[slideId];
            this._updateNoOfSlides();
            this._updateSizeAndDuration();
        }
    },

    _updateNoOfSlides: function () {
        this.noOfSlidesContainer.text(this.noOfSlides);
    },

    _updateSizeAndDuration: function () {
        var _this = this;
        _this.size = 0;
        _this.duration = 0;
        $.each(this.selectedSlides, function (slideId, slideDetails) {
            _this.size += slideDetails.size;
            _this.duration += slideDetails.duration;
        });
        this.sizeContainer.text(this.size.toFixed(2));
        this.durationContainer.text(this.duration);
    },

    _updateDuration: function () {
        var _this = this;
        _this.duration = 0;
        $(this.selectedSlides).each(function (slideId, slideDetails) {
            _this.duration += slideDetails.duration;
        });
        this.durationContainer.text(this.duration);
    },

    updateElementDuration: function (elId, duration) {
        this.selectedSlides[elId].duration
        this.duration = this.duration - this.selectedSlides[elId].duration;
        this.selectedSlides[elId].duration = duration;
        this.duration += duration;
        this.durationContainer.text(this.duration);
    },

    saveSlide: function() {
        var name = $("#presentationNameInput").val();
        var tablets = [];
        $(".mediaPointSelector:checked").each(function(i, el) {
            tablets.push(el.value)
        });
        var transition = this._getTransitionData();
        var data = {
            name: name,
            duration: this.duration,
            slides: this.selectedSlides,
            order: this.selectedSlidesOrder,
            tablets: tablets,
            transition: transition
        }
        $.ajax({
            type: "POST",
            url: this.saveUrl,
            data: data,
            dataType: "application/json"
        }).complete(function(resp) {
            var response = JSON.parse(resp.responseText);
            window.location = response.redirectTo;
        });
    },

    synchronizeDuration: function() {
        $.each(this.selectedSlides, function (slideId, slideDetails) {
            $("#duration_" + slideId).val(slideDetails.duration);
        });
    },

    checkTransitionDuration: function(el) {
        var val = parseInt(el.val(), 10);
        if(isNaN(val) || val < 100 || val > 1500) {
            el.val(200)
            return false
        }
        return true
    },

    _getTransitionData: function() {
        var inEffect, outEffect, inDuration, outDuration, extraTime, combine;
        inEffect = $("#transition_in_id :selected").val();
        outEffect = $("#transition_out_id :selected").val();
        inDuration = parseInt($("#transition_in_duration").val(), 10);
        outDuration = parseInt($("#transition_out_duration").val(), 10);
        extraTime = $("#transition_extra_time :selected").val() === "1" ? true : false;
        combine = $("#transition_combine").is(":checked");
        return {
            in_id: inEffect,
            in_duration: inDuration,
            in_combine: combine,
            out_id: outEffect,
            out_duration: outDuration,
            out_combine: combine,
            combine: combine,
            extra_time: extraTime
        }
    }
};


$(function () {
    Vantano.slides.init();

    if ($('#slideshow-wizard').length) {
        $('#slideshow-wizard').ace_wizard({
            //step: 2 //optional argument. wizard will jump to step "2" at first
            //buttons: '.wizard-actions:eq(0)'
        }).on('actionclicked.fu.wizard', function (e, info) {
            if (info.step == 1) {
                var nameContainer = $("#presentationNameInputContainer");
                if (!$('#presentationNameInput').val()) {
                    nameContainer.removeClass("has-info").addClass("has-error");
                    e.preventDefault();
                } else {
                    nameContainer.removeClass("has-error").addClass("has-info");
                }

            }
            if (info.step == 2) {
                Vantano.slides.synchronizeDuration();
                if (!Vantano.slides.selectedSlidesOrder.length) {
                    bootbox.alert(I18n.selectSlidesError);
                    e.preventDefault();
                }

            }
            if (info.step == 4) {
                if (!$(".mediaPointSelector:checked").length) {
                    bootbox.confirm(I18n.noMediaPointsWarning,
                    function(dec) {
                        if (dec) {
                            $("#selectedSlidesTable").hide();
                            $("#NoselectedSlidesTable").show();
                            var wizard = $('#slideshow-wizard').data('fu.wizard');
                            wizard.currentStep = 5;
                            wizard.setState();
                        }
                    });
                    e.preventDefault();
                } else {
                    $("#selectedSlidesTable tbody").html("");
                    $(".mediaPointSelector:checked").parent().parent().parent().clone().appendTo($("#selectedSlidesTable tbody"));
                    $("#selectedTabletsContainer #selectedSlidesTable tbody tr td:first-child").remove();
                    $("#selectedSlidesTable").show();
                    $("#NoselectedSlidesTable").hide();
                    $('#slidesPreviewContainer [data-rel="colorbox"]').colorbox.remove()
                    $('#slidesPreviewContainer [data-rel="colorbox"]').colorbox(Vantano.content.colorboxParams);
                    $("#cboxLoadingGraphic").html("<i class='ace-icon fa fa-spinner orange fa-spin'></i>");
                }
            }
        }).on('finished.fu.wizard', function (e) {
            var spinner = Vantano.utils.showSpinner(document.getElementById('slideshow-wizard'));
            var btn = $("#presentationSaveBtn");
//            btn.button('loading');
            Vantano.slides.saveSlide();
            e.preventDefault();
        }).on('stepclick.fu.wizard', function (e) {
            //e.preventDefault();//this will prevent clicking and selecting steps
        });

        $(".presentationSlideContainer").on("click", function () {
            Vantano.slides.handleSlideSelection(this);
        });
        $('.durationControl').ace_spinner({
            min: 2, max: 60, step: 1, on_sides: true, icon_up: 'ace-icon fa fa-plus', icon_down: 'ace-icon fa fa-minus', btn_up_class: 'btn-success', btn_down_class: 'btn-danger'
        });

        $('.durationControl').closest('.ace-spinner').on('changed.fu.spinbox', function (ev, duration) {
            var slideId = $(this).find("input").attr("id").split("_")[1];
            Vantano.slides.updateElementDuration(slideId, parseInt(duration));
            $("#slidePreviewDuration_" + slideId).text(duration);
        });

    }



    $("#selectAllMediaPointsButton").on("change", function() {
        $(".mediaPointSelector").prop("checked", $(this).prop("checked"))
    });

    $("#presentationSlidesOrderContainer").sortable({
        update: function () {
            Vantano.slides.selectedSlidesOrder = $("#presentationSlidesOrderContainer").sortable('serialize').replaceAll("forOrder[]=", '').split("&");
        }
    }).disableSelection();

    $("#transition_in_duration").on("blur", function() {
        Vantano.slides.checkTransitionDuration($(this))
    });

    $("#transition_out_duration").on("blur", function() {
        Vantano.slides.checkTransitionDuration($(this))
    });

});