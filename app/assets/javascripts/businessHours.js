(function ( $ ) {

    $.fn.businessHours = function( options ) {

        var settings = $.extend({
            daysLabels: "Sat,Fri,Thu,Wed,Tue,Mon,Sun",
            cornerLabel: "Hours / Days",
            unselectedLabel: "Active",
            selectedLabel: "Sleep",
            existingIntervals: []
        }, options );

        var tzHrs = -(new Date().getTimezoneOffset() / 60);

        function fuck(el) {

            var businessHoursContainer, daysLabels, hoursLabels, daysHours;
            var days = settings.daysLabels.split(",");
            businessHoursContainer = $("<div />");
            businessHoursContainer.addClass("businessHours-container");

            daysLabels = $("<div />");
            daysLabels.addClass("days-labels");
            for (var i=0; i < 7; i++) {
                var dayLabel = $("<div />");
                dayLabel.addClass("day-label");
                dayLabel.text(days[i]);
                dayLabel.appendTo(daysLabels);
            }
            daysLabels.appendTo(businessHoursContainer)

            hoursLabels = $("<div />");
            hoursLabels.addClass("hours-labels");
            $("<div>" + settings.cornerLabel + "</div>").appendTo(hoursLabels);
            for (var i=0; i < 25; i++) {
                var hourLabel = $("<div />");
                if (i < 10)
                    var text = "0" + i + ":00";
                else
                    var text = "" + i + ":00";

                hourLabel.addClass("hour-label");
                $('<span class="label label-warning arrowed-right arrowed-in pull-right">' + text + '</span>').appendTo(hourLabel);
                hourLabel.appendTo(hoursLabels);
            }
            hoursLabels.appendTo(businessHoursContainer);

            daysHours = $("<div />");
            daysHours.addClass("days-hours");
            daysHours.attr("id", "selectable");
            for (var i=1; i < 25; i++) {
                for (j=0; j<168; j+=24) {
                    var dayHour = $("<div />");
                    var localSlot = i+j;
                    var utcSlot = localToUtc(localSlot);
                    dayHour.addClass("day-hour");
                    dayHour.attr("data-slot", localSlot);
                    dayHour.attr("utc-data-slot", utcSlot);
                    if ($.inArray(utcSlot, settings.existingIntervals) === -1) {
                        dayHour.text(settings.unselectedLabel);
                    } else {
                        dayHour.text(settings.selectedLabel);
                        dayHour.addClass("ui-selected");
                    }
                    dayHour.appendTo(daysHours);
                }
            }
            daysHours.appendTo(businessHoursContainer);

            businessHoursContainer.appendTo(el);

            $( "#selectable" ).bind("mousedown", function(e) {
                e.metaKey = true;
            }).selectable({
                selected: function(ev, el) {
                    $(el.selected).text(settings.selectedLabel);
                },
                unselected: function(ev, el) {
                    $(el.unselected).text(settings.unselectedLabel);
                }
            });
        }

        function localToUtc(localSlot) {
            var utc = localSlot - tzHrs;
            if (utc < 1) {
                utc += 168
            }
            if (utc > 168) {
                utc -= 168
            }
            return utc
        }

        function utcToLocal(utcSlot) {
            var local = localSlot + tzHrs;
            if (local < 1) {
                local += 168
            }
            if (local > 168) {
                local -= 168
            }
            return local
        }

        return fuck(this);

    };



}( jQuery ));