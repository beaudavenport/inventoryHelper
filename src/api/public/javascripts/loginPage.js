$(document).ready(function() {
    $("form input[name=isHuman]").val("human");
    $("button.create").click(function() {
        $("form.hidden").removeClass("hidden").addClass("show");
    });
});