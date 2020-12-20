const regexUtils = require('./regex.utils');

class ValidationUtils {

    constructor() { }

    isValidArray(variable) {
        return Object.prototype.toString.call(variable) === '[object Array]';
    }

    // This method checks if a given value is a valid number and return the result.
    isValidNumber(number) {
        number = Number(number);
        return !isNaN(number) && typeof number == 'number';
    }

    isPositiveNumber(number) {
        if (!this.isValidNumber(number)) {
            return false;
        }
        return Number(number) > 0;
    }

    isExists(list) {
        return list && list.length > 0;
    }

    isValidURL(url) {
        return regexUtils.validateURLRegex.test(url);
    }

    isValidDate(dateTime) {
        return dateTime instanceof Date;
    }

    isValidDateFormat(date) {
        const parts = date.split('/');
        try {
            // Format: yyyy/mm/dd.
            new Date(parts[0], parts[1] - 1, parts[2]);
            return true;
        }
        catch {
            return false;
        }
    }

    // This method checks if a given variable is a valid boolean and return the result.
    isValidBoolean(boolean) {
        return typeof boolean == typeof true;
    }

    validateEmailAddress(emailAddress) {
        return regexUtils.validateEmailAddressRegex.test(emailAddress);
    }
}

module.exports = new ValidationUtils();