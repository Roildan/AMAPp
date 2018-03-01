// Display the address according the selected one on the form
// Called each time the user change the selected option
// Called on loading to initialize display

function displayAddress(obj) {
    $(".ui.secondary.segment").each(function() {
        if ($(this)[0].id === obj[0].value) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

displayAddress($("select[name='contract[delivery][address]'] option:selected"));
