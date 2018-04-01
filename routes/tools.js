// Time of 1 day (in milliseconds)
const dayTime = 1000 * 3600 * 24;

// Time of 1 week (in milliseconds)
const weekTime = dayTime * 7;

// Check if a delivery should be planned for the given week date
const checkContractValidity = function(contract, weekDate) {
    // Check whether the contract is active
    if (contract.date.start > weekDate || contract.date.end < weekDate) {
        return false;
    }

    // Check whether a delvery should be planned for this week
    if (contract.delivery.frequency !== 1) {
        const weekPassed = Math.floor((weekDate - contract.date.start) / weekTime);
        if (weekPassed !== 0 && weekPassed % contract.delivery.frequency !== 0) {
            return false;
        }
    }
    return true;
};

module.exports = {
    // Capitalize a string
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // Convert errors object from validator into a readable string
    errorsToStr: function(errors) {
        let errorsStr = "";
        for (let i = 0; i < errors.length; i++) {
            errorsStr += errors[i].msg + "\n";
        }
        // Remove last '\n'
        return errorsStr.slice(0, -1);
    },

    // Return the date of the next delivery, return 'null' if the contract is ended
    computeNextDelivery: function(contract) {
        const date = new Date(Date.now());

        // Check if the contract is ended
        if (date > contract.date.end) {
            return null;
        }

        while (!checkContractValidity(contract, date)) {
            date.setTime(date.getTime() + weekTime);
        }

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let dayOfDelivery;
        days.forEach(function(day, i) {
            if (day === contract.delivery.dayOfWeek) {
                dayOfDelivery = i;
            }
        });

        while (dayOfDelivery !== (date.getDay() === 0 ? 6 : date.getDay() - 1)) {
            if (dayOfDelivery > (date.getDay() === 0 ? 6 : date.getDay() - 1)) {
                date.setTime(date.getTime() + dayTime);
            }
            else {
                date.setTime(date.getTime() - dayTime);
            }
        }

        return date;
    },

    // Compute delivery planned for 'contracts' for 'nbWeek'
    // nbWeek = 1 --> Compute for this week
    // Else 'nbWeek' must be odd and will compute for (nbWeek/2) previous and following weeks + actual week
    computeDelivery: function(contracts, nbWeek) {
        // All the weeks that will be displayed
        const weeks = [];

        let weekIndex;
        let middle = Math.floor(nbWeek / 2);
        if (nbWeek === 1) {
            weekIndex = 0;
        }
        else if (nbWeek % 2 === 1) {
            weekIndex = -1 * middle;
        }
        else {
            throw "Input Error --> 'nbWeek' must be odd !";
        }

        for (weekIndex; weekIndex < middle + 1; weekIndex++) {
            const weekDate = Date.now() + weekTime * weekIndex;
            // Represents the 7 days of the week
            const days = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
            ];
            for (const contract of contracts) {
                // Check whether the contract is valid for this week
                if (!checkContractValidity(contract, weekDate)) {
                    continue;
                }

                // Order contracts in the corresponding day
                switch (contract.delivery.dayOfWeek) {
                    case "Monday":
                        days[0].push(contract);
                        break;
                    case "Tuesday":
                        days[1].push(contract);
                        break;
                    case "Wednesday":
                        days[2].push(contract);
                        break;
                    case "Thursday":
                        days[3].push(contract);
                        break;
                    case "Friday":
                        days[4].push(contract);
                        break;
                    case "Saturday":
                        days[5].push(contract);
                        break;
                    case "Sunday":
                        days[6].push(contract);
                        break;
                }
            }
            weeks.push(days);
        }
        return weeks;
    }
};
