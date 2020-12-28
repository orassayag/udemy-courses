const { applicationUtils, timeUtils } = require('../../../utils');

class ApplicationData {

	constructor(data) {
		// Set the parameters from the settings file.
		const { settings, status, mode } = data;
		const { IS_PRODUCTION_ENVIRONMENT, COURSES_BASE_URL, UDEMY_BASE_URL, SINGLE_COURSE_INIT, COURSES_DATE,
			SPECIFIC_COURSES_PAGE_NUMBER, IS_CREATE_COURSES_METHOD_ACTIVE, IS_UPDATE_COURSES_METHOD_ACTIVE,
			IS_PURCHASE_COURSES_METHOD_ACTIVE, KEY_WORDS_FILTER_LIST } = settings;
		this.isProductionEnvironment = IS_PRODUCTION_ENVIRONMENT;
		this.coursesBaseURL = COURSES_BASE_URL;
		this.udemyBaseURL = UDEMY_BASE_URL;
		this.singleCourseInit = SINGLE_COURSE_INIT;
		this.udemyLoginURL = `${this.udemyBaseURL}/join/login-popup/`;
		this.udemySuccessURL = `${this.udemyBaseURL}/cart/success/`;
		this.udemyLogoutURL = '/user/logout/';
		this.coursesDate = COURSES_DATE;
		this.specificCoursesPageNumber = SPECIFIC_COURSES_PAGE_NUMBER;
		this.keyWordsFilterList = KEY_WORDS_FILTER_LIST;
		this.isCreateCoursesMethodActive = IS_CREATE_COURSES_METHOD_ACTIVE;
		this.isUpdateCoursesMethodActive = IS_UPDATE_COURSES_METHOD_ACTIVE;
		this.isPurchaseCoursesMethodActive = IS_PURCHASE_COURSES_METHOD_ACTIVE;
		this.time = null;
		this.environment = applicationUtils.getApplicationEnvironment(this.isProductionEnvironment);
		this.mode = mode;
		this.method = null;
		this.status = status;
		this.startDateTime = null;
		this.logDateTime = `${timeUtils.getFullDateNoSpaces()}_${timeUtils.getDateNoSpacesFromString(this.coursesDate)}`;
	}
}

module.exports = ApplicationData;