const jsdom = require('jsdom');
const { CourseStatusEnum } = require('../../core/enums');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const courseService = require('./course.service');
const globalUtils = require('../../utils/files/global.utils');
const { courseUtils, systemUtils, textUtils, validationUtils } = require('../../utils');

class DomService {

    constructor() {
        this.createUpdateErrorsInARowCount = 0;
        // ===DOM=== //
        this.href = 'a';
        this.img = 'img';
        // ===COURSE=== //
        this.postDOM = 'type-product';
        this.postDOMTitle = 'woocommerce-loop-product__title';
        this.singleCourseURLDOM = 'woocommerce-LoopProduct-link';
        this.udemyURLInputName = 'cart';
        this.udemyURLAttribute = 'action';
        this.coursesListTitleDOM = 'course_title';
        this.coursesListContainerDOM = 'amz-deal';
        // ===UDEMY=== //
        this.loginEmailDOM = '#id_email';
        this.loginPasswordDOM = '#id_password';
        this.loginButtonDOM = '#submit-id-submit';
        this.signInHeaderDOM = '[data-purpose="header-login"]';
        this.loginErrorDOM = '.js-error-alert';
        this.courseBackgroundDOM = '.dark-background';
        this.courseNotExistsDOM = '.error__greeting';
        this.courseLimitAccessDOM = '[data-purpose="safely-set-inner-html:limited-access-container:title"]';
        this.coursePriceLabelDOM = '[data-purpose="course-price-text"]';
        this.coursesSuggestListDOM = '.udlite-heading-xxl';
        this.courseIsPrivateDOM = '.udi-lock';
        this.courseOriginalPriceDOM = '[data-purpose="course-old-price-text"]';
        this.courseEnrollButtonDOM = '[data-purpose="buy-this-course-button"]';
        this.courseLanguageLabelDOM = '[data-purpose="lead-course-locale"]';
        this.checkoutPriceDOM = '[data-purpose="total-price"]';
        this.purchaseButtonDOM = '.btn-block';
        this.purchaseSuccessDOM = '.alert-success';
    }

    async createSingleCourses(data) {
        let coursesCount = 0;
        try {
            const { mainContent, pageNumber, indexPageNumber } = data;
            const dom = new jsdom.JSDOM(mainContent);
            const courses = dom.window.document.getElementsByClassName(this.postDOM);
            for (let i = 0; i < courses.length; i++) {
                const courseDataModel = courses[i];
                const postId = courseDataModel.className.split(' ')[2];
                const title = courseDataModel.getElementsByClassName(this.postDOMTitle)[0];
                const url = courseDataModel.getElementsByClassName(this.singleCourseURLDOM)[0];
                await courseService.createCourse({
                    postId: parseInt(postId.split('-')[1]),
                    pageNumber: pageNumber,
                    indexPageNumber: indexPageNumber,
                    isFree: null,
                    courseURL: url?.href,
                    udemyURL: null,
                    couponKey: null,
                    courseURLCourseName: title?.text,
                    isSingleCourse: true
                });
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesCreate);
            }
            coursesCount = courses.length;
            this.validateErrorInARow(false);
            return {
                coursesCount: coursesCount,
                isErrorInARow: false
            };
        }
        catch (error) {
            if (this.validateErrorInARow(true)) {
                return {
                    coursesCount: coursesCount,
                    isErrorInARow: true
                };
            }
        }
    }

    async createCourseFullData(data) {
        const { courseDataModel, courseIndex, courseContent } = data;
        const coursesLists = [];
        try {
            const dom = new jsdom.JSDOM(courseContent);
            const urls = dom.window.document.getElementsByClassName(this.udemyURLInputName);
            if (validationUtils.isExists(urls)) {
                const result = courseUtils.createCourseSingleData(urls[0].getAttribute(this.udemyURLAttribute));
                await courseService.updateSingleCourseData({
                    courseDataModel: courseDataModel,
                    courseIndex: courseIndex,
                    udemyURL: result.udemyURL,
                    udemyURLCompare: textUtils.toLowerCaseTrim(result.udemyURL),
                    couponKey: result.couponKey
                });
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesUpdate);
            }
            if (validationUtils.isExists(coursesLists)) {
                await this.createCoursesList(coursesLists);
            }
            return this.validateErrorInARow(false);
        }
        catch (error) {
            courseService.coursesDataModel.coursesList[courseIndex] = await this.setCourseError(error, courseDataModel);
            if (this.validateErrorInARow(true)) {
                return true;
            }
        }
    }

    async createCoursesListWithNames(data) {
        const { courseDataModel, courseIndex, coursesDOMList } = data;
        try {
            for (let i = 0; i < coursesDOMList.length; i++) {
                const innerCourse = coursesDOMList[i];
                const url = innerCourse.getElementsByClassName(this.coursesListTitleDOM)[0];
                const udemyURL = url?.href;
                if (!this.isValidateUdemyURL(udemyURL)) {
                    continue;
                }
                await courseService.createCourse({
                    postId: courseDataModel.postId,
                    pageNumber: courseDataModel.pageNumber,
                    indexPageNumber: courseDataModel.indexPageNumber,
                    courseURL: courseDataModel.courseURL,
                    udemyURL: udemyURL,
                    udemyURLCompare: textUtils.toLowerCaseTrim(udemyURL),
                    couponKey: courseUtils.getCourseCoupon(udemyURL),
                    courseURLCourseName: url?.text,
                    isSingleCourse: false
                });
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesCreate);
                if (this.validateErrorInARow(false)) {
                    return true;
                }
            }
        }
        catch (error) {
            courseService.coursesDataModel.coursesList[courseIndex] = await this.setCourseError(error, courseDataModel);
            if (this.validateErrorInARow(true)) {
                return true;
            }
        }
    }

    async createCoursesListWithoutNames(data) {
        const { courseDataModel, courseIndex, courseURLsList } = data;
        try {
            for (let i = 0; i < courseURLsList.length; i++) {
                const udemyURL = courseURLsList[i]?.href;
                if (!this.isValidateUdemyURL(udemyURL)) {
                    continue;
                }
                await courseService.createCourse({
                    postId: courseDataModel.postId,
                    pageNumber: courseDataModel.pageNumber,
                    indexPageNumber: courseDataModel.indexPageNumber,
                    courseURL: courseDataModel.courseURL,
                    udemyURL: udemyURL,
                    udemyURLCompare: textUtils.toLowerCaseTrim(udemyURL),
                    couponKey: courseUtils.getCourseCoupon(udemyURL),
                    courseURLCourseName: null,
                    isSingleCourse: false
                });
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesCreate);
                if (this.validateErrorInARow(false)) {
                    return true;
                }
            }
        }
        catch (error) {
            courseService.coursesDataModel.coursesList[courseIndex] = await this.setCourseError(error, courseDataModel);
            if (this.validateErrorInARow(true)) {
                return true;
            }
        }
    }

    async createCoursesList(coursesLists) {
        let isErrorInARow = false;
        for (let i = 0; i < coursesLists.length; i++) {
            const { courseDataModel, courseIndex, dom } = coursesLists[i];
            try {
                const coursesDOMList = dom.window.document.getElementsByClassName(this.coursesListContainerDOM);
                if (validationUtils.isExists(coursesDOMList)) {
                    if (await this.createCoursesListWithNames({
                        courseDataModel: courseDataModel,
                        courseIndex: courseIndex,
                        coursesDOMList: coursesDOMList
                    })) {
                        isErrorInARow = true;
                        break;
                    }
                }
                else {
                    if (await this.createCoursesListWithoutNames({
                        courseDataModel: courseDataModel,
                        courseIndex: courseIndex,
                        courseURLsList: dom.window.document.getElementsByTagName(this.href)
                    })) {
                        isErrorInARow = true;
                        break;
                    }
                }
                await courseService.updateCoursesListCourseData({
                    courseDataModel: courseDataModel,
                    courseIndex: courseIndex
                });
                return isErrorInARow ? isErrorInARow : this.validateErrorInARow(false);
            }
            catch (error) {
                courseService.coursesDataModel.coursesList[courseIndex] = await this.setCourseError(error, courseDataModel);
                if (this.validateErrorInARow(true)) {
                    return true;
                }
            }
        }
    }

    validateErrorInARow(isError) {
        if (isError) {
            this.createUpdateErrorsInARowCount++;
            return this.createUpdateErrorsInARowCount >= countLimitService.countLimitDataModel.maximumCreateUpdateErrorInARowCount;
        }
        else {
            this.createUpdateErrorsInARowCount = 0;
        }
        return false;
    }

    async setCourseError(error, courseDataModel) {
        return await courseService.updateCourseStatus({
            courseDataModel: courseDataModel, status: CourseStatusEnum.CREATE_UPDATE_ERROR,
            details: `Unexpected error occurred during the create update process. More details: ${systemUtils.getErrorDetails(error)}`
        });
    }

    isValidateUdemyURL(udemyURL) {
        return udemyURL && udemyURL.indexOf(applicationService.applicationDataModel.udemyBaseURL) > -1;
    }
}

module.exports = new DomService();