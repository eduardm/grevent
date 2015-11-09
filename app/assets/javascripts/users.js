Vantano.users = {

};

$(function () {

    $("#loginButton").on("click", function () {
        var form = $("#loginUserForm");
        $.post(form.attr("action"), form.serialize()).done(function (response) {
            console.log(response)
            if (response.success) {
                window.location = response.redirect;
            } else {
                $("#user_email, #user_password").parent().addClass("has-error");
            }
        });
    });

    $("#registerUserButton").on("click", function () {
        var form = $("#registerUserForm");
        $.post(form.attr("action"), form.serialize()).done(function (response) {
            if (response.success) {
                window.location = response.redirect;
            } else {
                $(response.errors).each(function (i, errorField) {
                    var field = $("#user_register_" + errorField);
                    if (errorField === "accepted_toc") {
                        field.parent().css({border: "1px solid rgb(169, 68, 66)", color: "rgb(169, 68, 66)"});
                    } else {
                        field.parent().addClass("has-error");
                        field.next("i").removeClass();
                        field.next("i").addClass("ace-icon fa fa-times-circle red");
                    }
                });
            }
        });
    })
});
