class LogData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { IS_LOG_CREATE_COURSES_VALID, IS_LOG_CREATE_COURSES_INVALID,
			IS_LOG_UPDATE_COURSES_VALID, IS_LOG_UPDATE_COURSES_INVALID,
			IS_LOG_PURCHASE_COURSES_VALID, IS_LOG_PURCHASE_COURSES_INVALID } = settings;
		this.isLogCreateCoursesValid = IS_LOG_CREATE_COURSES_VALID;
		this.isLogCreateCoursesInvalid = IS_LOG_CREATE_COURSES_INVALID;
		this.isLogUpdateCoursesValid = IS_LOG_UPDATE_COURSES_VALID;
		this.isLogUpdateCoursesInvalid = IS_LOG_UPDATE_COURSES_INVALID;
		this.isLogPurchaseCoursesValid = IS_LOG_PURCHASE_COURSES_VALID;
		this.isLogPurchaseCoursesInvalid = IS_LOG_PURCHASE_COURSES_INVALID;
	}
}

module.exports = LogData;