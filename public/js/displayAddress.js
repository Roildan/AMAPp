// Display the address according the selected one on the form
// Called each time the user change the selected option
// Called on loading to initialize display

function displayAddress(obj) {
    $(".address").each(function() {
        if (!obj[0].value) {
            $("#divAddress").hide();
        }
        else {
            $("#divAddress").show();
        }

        if ($(this)[0].id === obj[0].value) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

displayAddress($("select[name='contract[delivery][address]'] option:selected"));
