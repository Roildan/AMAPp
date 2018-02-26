module.exports = {
    errorsToStr: function(errors) {
        let errorsStr = "";
        for (let i = 0; i < errors.length; i++) {
            errorsStr += errors[i].msg + "\n";
        }
        // Remove last '\n'
        return errorsStr.slice(0, -1);
    }
};
