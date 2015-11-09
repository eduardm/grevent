Vantano.dashboard = {
    rangeLabels: {
        today: I18n.today,
        yesterday: I18n.yesterday,
        last7days: I18n.last7days,
        last30days: I18n.last30days,
        thismonth: I18n.thismonth,
        lastmonth: I18n.lastmonth,
    },
    dateRanges: {},
    setDateRanges: function() {
        this.dateRanges[this.rangeLabels.today] = [moment(), moment()];
        this.dateRanges[this.rangeLabels.yesterday] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
        this.dateRanges[this.rangeLabels.last7days] = [moment().subtract(6, 'days'), moment()];
        this.dateRanges[this.rangeLabels.last30days] = [moment().subtract(29, 'days'), moment()];
        this.dateRanges[this.rangeLabels.thismonth] = [moment().startOf('month'), moment().endOf('month')];
        this.dateRanges[this.rangeLabels.lastmonth] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
    }
};


$(function() {

    Vantano.dashboard.setDateRanges();

    function cb(start, end, skipRequest) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        if(!skipRequest) {
            alert("Date changed");
        }
    }
    cb(moment(), moment(), true);

    $('#reportrange').daterangepicker({
        ranges: Vantano.dashboard.dateRanges,
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": I18n.apply,
            "cancelLabel": I18n.cancel,
            "fromLabel": I18n.from,
            "toLabel": I18n.to,
            "customRangeLabel": I18n.custom,
            "daysOfWeek": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            "firstDay": 1
        },
    }, cb);


});
