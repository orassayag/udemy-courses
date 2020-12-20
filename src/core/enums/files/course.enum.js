const enumUtils = require('../enum.utils');
const textUtils = require('../text.utils');

const CourseStatus = enumUtils.createEnum([
    ['CREATE', 'create'],
    ['FILTER', 'filter'],
    ['MISSING_FIELD', 'missingField'],
    ['UNEXPECTED_FIELD', 'unexpectedField'],
    ['DUPLICATE', 'duplicate'],
    ['GET_ERROR', 'getError'],
    ['EMPTY_URL', 'emptyURL'],
    ['NOT_EXISTS', 'notExists'],
    ['LIMIT_ACCESS', 'limitAccess'],
    ['SUGGESTIONS_LIST', 'suggestionsList'],
    ['PRIVATE', 'private'],
    ['ALREADY_PURCHASE', 'alreadyPurchase'],
    ['COURSE_PRICE_NOT_FREE', 'coursePriceNotFree'],
    ['ENROLL_NOT_EXISTS', 'enrollNotExists'],
    ['CHECKOUT_PRICE_NOT_EXISTS', 'checkoutPriceNotExists'],
    ['CHECKOUT_PRICE_NOT_FREE', 'checkoutPriceNotFree'],
    ['PURCHASE_ERROR', 'purchaseError'],
    ['FAIL', 'fail'],
    ['PURCHASE', 'purchase']
]);

const CourseStatusLog = enumUtils.createEnum(Object.keys(CourseStatus).map(k => {
    return [CourseStatus[k], textUtils.replaceCharacter(k, '_', ' ')];
}));

const CourseType = enumUtils.createEnum([
    ['SINGLE', 'SINGLE'],
    ['COURSES_LIST', 'COURSES LIST']
]);

module.exports = { CourseStatus, CourseStatusLog, CourseType };