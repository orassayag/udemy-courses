import enumUtils from '../enum.utils.js';
import textUtils from '../text.utils.js';

const CourseStatusEnum = enumUtils.createEnum([
  ['CREATE', 'create'],
  ['PURCHASE', 'purchase'],
  ['FAIL', 'fail'],
  ['FILTER', 'filter'],
  ['MISSING_FIELD', 'missingField'],
  ['UNEXPECTED_FIELD', 'unexpectedField'],
  ['DUPLICATE', 'duplicate'],
  ['CREATE_UPDATE_ERROR', 'createUpdateError'],
  ['EMPTY_URL', 'emptyURL'],
  ['INVALID_URL', 'invalidURL'],
  ['NOT_EXISTS', 'notExists'],
  ['PAGE_NOT_FOUND', 'pageNotFound'],
  ['LIMIT_ACCESS', 'limitAccess'],
  ['SUGGESTIONS_LIST', 'suggestionsList'],
  ['PRIVATE', 'private'],
  ['ALREADY_PURCHASE', 'alreadyPurchase'],
  ['COURSE_PRICE_NOT_FREE', 'coursePriceNotFree'],
  ['ENROLL_NOT_EXISTS', 'enrollNotExists'],
  ['CHECKOUT_PRICE_NOT_EXISTS', 'checkoutPriceNotExists'],
  ['CHECKOUT_PRICE_NOT_FREE', 'checkoutPriceNotFree'],
  ['PURCHASE_ERROR', 'purchaseError'],
]);

const CourseStatusLogEnum = enumUtils.createEnum(
  Object.keys(CourseStatusEnum).map((k) => {
    return [CourseStatusEnum[k], textUtils.replaceCharacter(k, '_', ' ')];
  })
);

const CourseTypeEnum = enumUtils.createEnum([
  ['SINGLE', 'SINGLE'],
  ['COURSES_LIST', 'COURSES LIST'],
]);

export { CourseStatusEnum, CourseStatusLogEnum, CourseTypeEnum };
