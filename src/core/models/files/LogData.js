class LogData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { IS_LOG_GET_COURSES_VALID, IS_LOG_GET_COURSES_INVALID, IS_LOG_PURCHASE_COURSES_VALID,
			IS_LOG_PURCHASE_COURSES_INVALID } = settings;
		this.isLogGetCoursesValid = IS_LOG_GET_COURSES_VALID;
		this.isLogGetCoursesInvalid = IS_LOG_GET_COURSES_INVALID;
		this.isLogPurchaseCoursesValid = IS_LOG_PURCHASE_COURSES_VALID;
		this.isLogPurchaseCoursesInvalid = IS_LOG_PURCHASE_COURSES_INVALID;
	}
}

module.exports = LogData;