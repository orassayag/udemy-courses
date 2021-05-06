const { CourseDataModel, CoursesDataModel, ValidateFieldsResultModel } = require('../../core/models');
const { CourseStatusEnum, CourseTypeEnum, StatusEnum } = require('../../core/enums');
const applicationService = require('./application.service');
const { courseUtils, textUtils, timeUtils, validationUtils } = require('../../utils');

class CourseService {

    constructor() {
        this.coursesDataModel = new CoursesDataModel();
        this.lastCourseId = 1;
        this.logCourse = null;
    }

    initiate(logCourse) {
        if (validationUtils.isExists(applicationService.applicationDataModel.keywordsFilterList)) {
            for (let i = 0; i < applicationService.applicationDataModel.keywordsFilterList.length; i++) {
                applicationService.applicationDataModel.keywordsFilterList[i] = textUtils.toLowerCaseTrim(applicationService.applicationDataModel.keywordsFilterList[i]);
            }
        }
        this.logCourse = logCourse;
    }

    getUdemyCourseName(udemyURL) {
        if (!udemyURL) {
            return null;
        }
        udemyURL = udemyURL.replace(applicationService.applicationDataModel.udemyCourseURL, '');
        udemyURL = udemyURL.slice(0, udemyURL.indexOf('/'));
        return textUtils.getCapitalEachWordFromURL(udemyURL);
    }

    async validateUdemyURL(courseDataModel) {
        const { udemyURL } = courseDataModel;
        if (!udemyURL) {
            return courseDataModel;
        }
        if (udemyURL.indexOf(applicationService.applicationDataModel.udemyBaseURL) === -1) {
            courseDataModel = await this.updateCourseStatus({
                courseDataModel: courseDataModel,
                status: CourseStatusEnum.INVALID_URL,
                details: 'The Udemy URL is invalid.'
            });
        }
        return courseDataModel;
    }

    async createCourse(courseDataModel) {
        courseDataModel.id = this.lastCourseId;
        if (courseDataModel.isSingleCourse) {
            this.coursesDataModel.totalSingleCount++;
        }
        else {
            this.coursesDataModel.totalCourseListCount++;
        }
        courseDataModel = new CourseDataModel(courseDataModel);
        courseDataModel.udemyURLCourseName = this.getUdemyCourseName(courseDataModel.udemyURL);
        courseDataModel = await this.validateUdemyURL(courseDataModel);
        this.coursesDataModel.coursesList.push(courseDataModel);
        this.lastCourseId++;
        this.coursesDataModel.courseDataModel = courseDataModel;
        await this.logCourse(courseDataModel);
    }

    async updateSingleCourseData(data) {
        const { courseIndex, udemyURL, udemyURLCompare, couponKey } = data;
        let { courseDataModel } = data;
        courseDataModel.udemyURL = udemyURL;
        courseDataModel.udemyURLCompare = udemyURLCompare;
        courseDataModel.udemyURLCourseName = this.getUdemyCourseName(udemyURL);
        courseDataModel.couponKey = couponKey;
        courseDataModel = await this.validateUdemyURL(courseDataModel);
        this.coursesDataModel.coursesList[courseIndex] = courseDataModel;
        this.coursesDataModel.courseDataModel = courseDataModel;
        await this.logCourse(courseDataModel);
    }

    async updateCoursesListCourseData(data) {
        const { courseDataModel, courseIndex } = data;
        courseDataModel.isFree = false;
        this.coursesDataModel.coursesList[courseIndex] = courseDataModel;
        this.coursesDataModel.courseDataModel = courseDataModel;
        await this.logCourse(courseDataModel);
    }

    async updateCourseStatus(data) {
        const { courseDataModel, status, details } = data;
        const originalStatus = courseDataModel.status;
        courseDataModel.status = status;
        courseDataModel.resultDateTime = timeUtils.getCurrentDate();
        courseDataModel.resultDetails.push(details);
        if (originalStatus !== CourseStatusEnum.CREATE) {
            this.coursesDataModel.updateCount(false, originalStatus, 1);
        }
        this.coursesDataModel.updateCount(true, status, 1);
        this.coursesDataModel.courseDataModel = courseDataModel;
        await this.logCourse(courseDataModel);
        return courseDataModel;
    }

    updateCoursePrices(data) {
        const { courseDataModel, originalPrices, status } = data;
        courseDataModel.priceNumber = originalPrices.priceNumber;
        courseDataModel.priceDisplay = originalPrices.priceDisplay;
        this.coursesDataModel.totalCoursesPriceNumber += originalPrices.priceNumber;
        if (status === CourseStatusEnum.PURCHASE) {
            this.coursesDataModel.totalPurchasePriceNumber += originalPrices.priceNumber;
        }
        return courseDataModel;
    }

    async finalizeCreateUpdateCourses() {
        // Validate any courses that exist to purchase.
        if (!validationUtils.isExists(this.coursesDataModel.coursesList)) {
            return StatusEnum.NO_COURSES_EXISTS;
        }
        for (let i = 0; i < this.coursesDataModel.coursesList.length; i++) {
            const courseDataModel = this.coursesDataModel.coursesList[i];
            // Validate all fields.
            let scanFieldsResult = this.validateFields(courseDataModel);
            if (scanFieldsResult) {
                this.coursesDataModel.coursesList[i] = await this.updateCourseStatus({
                    courseDataModel: courseDataModel,
                    status: scanFieldsResult.status,
                    details: scanFieldsResult.details
                });
            }
            if (validationUtils.isExists(applicationService.applicationDataModel.keywordsFilterList)) {
                if (this.filter(courseDataModel)) {
                    this.coursesDataModel.coursesList[i] = await this.updateCourseStatus({
                        courseDataModel: courseDataModel,
                        status: CourseStatusEnum.FILTER,
                        details: 'The course has been filtered since no entered keywords have been found to match the course name.'
                    });
                }
            }
            // Compare courses and detect duplicates.
            await this.compareCourses(courseDataModel);
        }
        // Validate that there are any courses to purchase.
        if (!validationUtils.isExists(this.coursesDataModel.coursesList.filter(c => c.status === CourseStatusEnum.CREATE))) {
            return StatusEnum.NO_VALID_COURSES_EXISTS;
        }
    }

    validateFields(courseDataModel) {
        // Validate all expected fields.
        let scanFieldsResult = this.scanFields({
            courseDataModel: courseDataModel,
            keysList: ['id', 'creationDateTime', 'pageNumber', 'type', 'isFree', 'courseURL', 'status'],
            isFilledExpected: true
        });
        if (scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate all unexpected fields.
        scanFieldsResult = this.scanFields({
            courseDataModel: courseDataModel,
            keysList: ['priceNumber', 'priceDisplay', 'resultDateTime'],
            isFilledExpected: false
        });
        if (scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate Udemy URL.
        const { type, isFree, udemyURL, couponKey, status } = courseDataModel;
        if (udemyURL) {
            if (udemyURL.indexOf(applicationService.applicationDataModel.udemyBaseURL) === -1) {
                return new ValidateFieldsResultModel({
                    status: CourseStatusEnum.INVALID,
                    details: 'Field udemyURL does not match as Udemy website.'
                });
            }
        }
        else if (type === CourseTypeEnum.SINGLE && status === CourseStatusEnum.CREATE) {
            return new ValidateFieldsResultModel({
                status: CourseStatusEnum.INVALID,
                details: 'Field udemyURL is empty and the course is not in the type of COURSES_LIST.'
            });
        }
        // Validate free course coupon or free course originally.
        if (isFree && !couponKey) {
            return new ValidateFieldsResultModel({
                status: CourseStatusEnum.INVALID,
                details: 'Field isFree set to true, but couponKey field is not empty.'
            });
        }
        return null;
    }

    filter(courseDataModel) {
        const { udemyURLCompare, status } = courseDataModel;
        if (!udemyURLCompare || status !== CourseStatusEnum.CREATE) {
            return true;
        }
        const udemyKeywords = courseUtils.getUdemyURLKeywords(udemyURLCompare, applicationService.applicationDataModel.udemyBaseURL);
        if (!validationUtils.isExists(udemyKeywords)) {
            return true;
        }
        for (let i = 0; i < applicationService.applicationDataModel.keywordsFilterList.length; i++) {
            const keyword = applicationService.applicationDataModel.keywordsFilterList[i];
            for (let y = 0; y < udemyKeywords.length; y++) {
                if (keyword === udemyKeywords[y]) {
                    return false;
                }
            }
        }
        return true;
    }

    scanFields(data) {
        const { courseDataModel, keysList, isFilledExpected } = data;
        let scanFieldsResult = null;
        for (let i = 0; i < keysList.length; i++) {
            const key = keysList[i];
            const value = courseDataModel[key];
            if (isFilledExpected) {
                if (validationUtils.isEmpty(value)) {
                    scanFieldsResult = {
                        status: CourseStatusEnum.MISSING_FIELD,
                        details: `Field ${key} should not be empty, but does not contain any value.`
                    };
                    break;
                }
            }
            else {
                if (!validationUtils.isEmpty(value)) {
                    scanFieldsResult = {
                        status: CourseStatusEnum.UNEXPECTED_FIELD,
                        details: `Field ${key} should be empty, but found the value ${value}.`
                    };
                    break;
                }
            }
        }
        return scanFieldsResult;
    }

    async compareCourses(courseDataModel) {
        // Check if duplicate courses exist, not to enter Udemy course page several times.
        if (courseDataModel.status !== CourseStatusEnum.CREATE) {
            return;
        }
        for (let i = 0; i < this.coursesDataModel.coursesList.length; i++) {
            const currentCourse = this.coursesDataModel.coursesList[i];
            if (courseDataModel.id === currentCourse.id || currentCourse.status !== CourseStatusEnum.CREATE) {
                continue;
            }
            if (courseDataModel.udemyURLCompare === currentCourse.udemyURLCompare) {
                this.coursesDataModel.coursesList[i] = await this.updateCourseStatus({
                    courseDataModel: currentCourse,
                    status: CourseStatusEnum.DUPLICATE,
                    details: 'This course repeats multiple times in this session and should be purchased.'
                });
            }
        }
    }

    createSessionCourses(urls) {
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            this.coursesDataModel.coursesList.push(new CourseDataModel({
                id: this.lastCourseId,
                postId: null,
                pageNumber: 1,
                indexPageNumber: 1,
                isFree: false,
                courseURL: null,
                udemyURL: url,
                udemyURLCompare: textUtils.toLowerCaseTrim(url),
                couponKey: null,
                courseURLCourseName: null,
                isSingleCourse: true
            }));
            this.lastCourseId++;
        }
    }
}

module.exports = new CourseService();