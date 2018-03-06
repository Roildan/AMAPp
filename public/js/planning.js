// Time of 1 week (in milliseconds)
const weekTime = 1000 * 3600 * 24 * 7;

const start = new Date(Date.now() - weekTime * 2);

// Add or subtract 1 to current month if the month if changing
const getMonth = function(date, month, daysPerMonth, nbDays) {
    const newDate = date - nbDays;
    if (newDate < 1) {
        return month === 0 ? 11 : month - 1;
    }
    else if (newDate > daysPerMonth[month]) {
        return month === 11 ? 0 : month + 1;
    }
    else {
        return month;
    }
};

// Adapt date if month is changing
const getDate = function(date, month, daysPerMonth, nbDays) {
    const newDate = date - nbDays;
    if (newDate < 1) {
        return daysPerMonth[month - 1] + (newDate);
    }
    else if (newDate > daysPerMonth[month]) {
        return newDate - daysPerMonth[month];
    }
    else {
        return newDate;
    }
};

const display = function(date) {
    const thisDate = date.getDate();
    const thisYear = date.getFullYear();
    const thisMonth = date.getMonth();

    // Change day to go from Monday to Sunday instead of Sunday to Saturday
    const thisDay = date.getDay() === 0 ? 6 : date.getDay() - 1;

    // Check whether this is a leap year
    const isLeapYear = thisYear % 400 === 0 || (thisYear % 100 !== 0 && thisYear % 4 === 0);

    // Store the number of days for each month of this year
    const daysPerMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    $(".Date").each(function(i) {
        $(this).text(getDate(thisDate, thisMonth, daysPerMonth, thisDay - i));
    });

    $(".Month").each(function(i) {
        $(this).text(1 + getMonth(thisDate, thisMonth, daysPerMonth, thisDay - i));
    });
};

display(start);

$("#prevButton").on("click", function() {
    // If nextButton was hidden
    $("#nextButton").show();

    // Find the planning currently displayed
    const displayed = Number($(".planning:visible")[0].id);
    $("#" + displayed).hide();

    const toBeDisplayed = displayed - 1;
    $("#" + toBeDisplayed).show();

    if (toBeDisplayed === 0) {
        $("#prevButton").hide();
    }
});

$("#nextButton").on("click", function() {
    // If nextButton was hidden
    $("#prevButton").show();

    // Find the planning currently displayed
    const displayed = Number($(".planning:visible")[0].id);
    $("#" + displayed).hide();

    const toBeDisplayed = displayed + 1;
    $("#" + toBeDisplayed).show();

    if (toBeDisplayed === 4) {
        $("#nextButton").hide();
    }
});
