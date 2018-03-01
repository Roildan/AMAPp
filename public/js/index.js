$("#mail").hide();

$("#onClick").on("click", function() {
    $(this).hide();
    $("#mail").show();
});

$("#mail").on("click", function() {
    $(this).hide();
    $("#onClick").show();
});
