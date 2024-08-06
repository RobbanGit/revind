/**
 * validates if a string can be used as a review title or not.
 * @param inputTitle a string to be checked
 * @returns {boolean} true if it can be used
 */
exports.checkTitle = function (inputTitle) {
    if (inputTitle.length < 64) {
        return true;
    } else {
        return false;
    }
}

/**
 * validates if a string can be used as a review description or not.
 * @param inputString a string to be checked
 * @returns {boolean} true if it can be used
 */
exports.checkDescription = function (inputString) {
    if (inputString.length < 256) {
        return true;
    } else {
        return false;
    }
}

/**
 * validates if a string can be used as a review description or not.
 * @param newRating an integer to be checked
 * @returns {boolean} true if between 1-5
 */
exports.checkRating = function (newRating) {
    var rating = parseInt(newRating,10)
    if (Number.isInteger(rating)) {
        if (rating > 0 && rating < 6) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * The regex is taken from a existing repo, linked below.
 * https://github.com/pensierinmusica/email-check/blob/6ebb472532a488be84aa1a93346abdbcb861e405/index.js
 * @param inputEmail the string you want to validate
 * @returns {boolean} if inputEmail is valid, returns true.
 */
exports.validateEmail = function (inputEmail) {
    const EMAIL_CHECK = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return EMAIL_CHECK.test(inputEmail);
}