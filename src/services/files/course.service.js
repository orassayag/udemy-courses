const applicationService = require('./application.service');
const { CourseData, CoursesData } = require('../../core/models');
const { CourseStatus, CourseType, Status } = require('../../core/enums');
const { courseUtils, textUtils, validationUtils } = require('../../utils');

class CourseService {

    constructor() {
        this.coursesData = new CoursesData();
        this.lastCourseId = 1;
    }

    initiate() {
        if (validationUtils.isExists(applicationService.applicationData.keyWordsFilterList)) {
            for (let i = 0; i < applicationService.applicationData.keyWordsFilterList.length; i++) {
                applicationService.applicationData.keyWordsFilterList[i] = textUtils.toLowerCaseTrim(applicationService.applicationData.keyWordsFilterList[i]);
            }
        }
    }

    createCourse(course) {
        course.id = this.lastCourseId;
        course = new CourseData(course);
        this.coursesData.coursesList.push(course);
        this.lastCourseId++;
        this.coursesData.course = course;
    }

    updateSingleCourseData(data) {
        const { course, courseIndex, udemyURL, udemyURLCompare, couponKey } = data;
        course.udemyURL = udemyURL;
        course.udemyURLCompare = udemyURLCompare;
        course.couponKey = couponKey;
        course.isFree = !validationUtils.isExists(couponKey);
        this.coursesData.coursesList[courseIndex] = course;
        this.coursesData.course = course;
    }

    updateCoursesListCourseData(data) {
        let { course, courseIndex } = data;
        course.isFree = false;
        course.type = CourseType.COURSES_LIST;
        this.coursesData.coursesList[courseIndex] = course;
        this.coursesData.course = course;
    }

    updateCourseStatus(data) {
        const { course, status, details } = data;
        const originalStatus = course.status;
        course.status = status;
        course.resultDateTime = new Date();
        course.resultDetails.push(details);
        if (originalStatus !== CourseStatus.CREATE) {
            this.coursesData.updateCount(false, originalStatus, 1);
        }
        this.coursesData.updateCount(true, status, 1);
        this.coursesData.course = course;
        return course;
    }

    finalizeGetCourses() {
        // Validate any courses exists to purchase.
        if (this.coursesData.coursesList.length <= 0) {
            return Status.NO_COURSES_EXISTS;
        }
        for (let i = 0; i < this.coursesData.coursesList.length; i++) {
            const course = this.coursesData.coursesList[i];
            // Validate all fields.
            let scanFieldsResult = this.validate(course);
            if (scanFieldsResult) {
                this.coursesData.coursesList[i] = this.updateCourseStatus({
                    course: course,
                    status: scanFieldsResult.status,
                    details: scanFieldsResult.details
                });
            }
            if (validationUtils.isExists(applicationService.applicationData.keyWordsFilterList)) {
                if (this.filter(course)) {
                    this.coursesData.coursesList[i] = this.updateCourseStatus({
                        course: course,
                        status: CourseStatus.FILTER,
                        details: 'The course has been filtered since no entered key words has been found match to the course name.'
                    });
                }
            }
            // Compare courses and detect duplicates.
            this.compare(course);
        }
        // Validate that there are any courses to purchase.
        if (this.coursesData.coursesList.map(c => c.status === CourseStatus.CREATE).length <= 0) {
            return Status.NO_VALID_COURSES_EXISTS;
        }
    }

    validate(course) {
        // Validate all expected fields.
        let scanFieldsResult = this.scanFields({
            course: course,
            keysList: ['id', 'creationDateTime', 'pageNumber', 'publishDate', 'type', 'isFree', 'courseURL', 'status'],
            isExpectedFilled: true
        });
        if (!scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate all unexpected fields.
        scanFieldsResult = this.scanFields({
            course: course,
            keysList: ['priceNumber', 'priceDisplay', 'resultDateTime', 'resultDetails'],
            isExpectedFilled: false
        });
        if (!scanFieldsResult) {
            return scanFieldsResult;
        }
        // Validate Udemy URL.
        const { type, isFree, udemyURL, couponKey, status } = course;
        if (udemyURL) {
            if (udemyURL.indexOf(applicationService.applicationData.udemyBaseURL) === -1) {
                return {
                    status: CourseStatus.INVALID,
                    details: 'Field udemyURL does not match as Udemy website.'
                };
            }
        }
        else if (type === CourseType.SINGLE && status === CourseStatus.CREATE) {
            return {
                status: CourseStatus.INVALID,
                details: 'Field udemyURL is empty and the course is not in the type of COURSES_LIST.'
            };
        }
        // Validate free course coupon or free course originally.
        if (isFree && couponKey) {
            return {
                status: CourseStatus.INVALID,
                details: 'Field isFree set to true, but couponKey field is not empty.'
            };
        }
        return null;
    }

    filter(course) {
        const { udemyURLCompare, status } = course;
        if (!udemyURLCompare || status !== CourseStatus.CREATE) {
            return true;
        }
        const udemyKeyWords = courseUtils.getUdemyURLKeyWords(udemyURLCompare, applicationService.applicationData.udemyBaseURL);
        if (!validationUtils.isExists(udemyKeyWords)) {
            return true;
        }
        for (let i = 0; i < applicationService.applicationData.keyWordsFilterList.length; i++) {
            const keyWord = applicationService.applicationData.keyWordsFilterList[i];
            for (let y = 0; y < udemyKeyWords.length; y++) {
                if (keyWord === udemyKeyWords[y]) {
                    return false;
                }
            }
        }
        return true;
    }

    scanFields(data) {
        const { course, keysList, isExpectedFilled } = data;
        let scanFieldsResult = null;
        for (let i = 0; i < keysList.length; i++) {
            const key = keysList[i];
            const value = course[key];
            if (isExpectedFilled) {
                if (!value) {
                    scanFieldsResult = {
                        status: CourseStatus.MISSING_FIELD,
                        details: `Field ${key} should not be empty, but does not contain any value.`
                    };
                    break;
                }
            }
            else {
                if (value) {
                    scanFieldsResult = {
                        status: CourseStatus.UNEXPECTED_FIELD,
                        details: `Field ${key} should be empty, but found the value ${value}.`
                    };
                    break;
                }
            }
        }
        return scanFieldsResult;
    }

    compare(course) {
        // Check if duplicate courses exists, not to enter Udemy course page several times.
        if (course.status !== CourseStatus.CREATE) {
            return;
        }
        for (let i = 0; i < this.coursesData.coursesList.length; i++) {
            const currentCourse = this.coursesData.coursesList[i];
            if (course.id === currentCourse.id || currentCourse.status !== CourseStatus.CREATE) {
                continue;
            }
            if (course.udemyURLCompare === currentCourse.udemyURLCompare) {
                this.coursesData.coursesList[i] = this.updateCourseStatus({
                    course: currentCourse,
                    status: CourseStatus.DUPLICATE,
                    details: 'This course repeats multiple times in this session and should be purchased.'
                });
            }
        }
    }

    createSessionCourses(urls) {
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            this.coursesData.coursesList.push(new CourseData({
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
                publishDate: null,
                isSingleCourse: true
            }));
            this.lastCourseId++;
        }
    }
}

module.exports = new CourseService();