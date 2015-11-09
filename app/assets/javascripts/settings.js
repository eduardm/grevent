
Vantano.settings = {

    getSleepHours: function() {
        var sleepHours = [];
        $(".ui-selected").each(function(idx, el) {
            sleepHours.push(parseInt($(el).attr("utc-data-slot")));
        });
        return sleepHours;
    }
};


$(function() {


    $("#sleepIntervalsForm").submit( function(eventObj) {
        $('<input />').attr('type', 'hidden')
            .attr('name', "sleepIntervals")
            .attr('value', Vantano.settings.getSleepHours())
            .appendTo('#sleepIntervalsForm');
        return true;
    });
});
