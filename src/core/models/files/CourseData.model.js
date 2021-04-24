const { CourseStatusEnum, CourseTypeEnum } = require('../../enums');
const { timeUtils } = require('../../../utils');

class CourseDataModel {

    constructor(course) {
        const { id, postId, pageNumber, indexPageNumber, isFree, courseURL, udemyURL,
            udemyURLCompare, couponKey, courseURLCourseName, isSingleCourse } = course;
        this.id = id;
        this.postId = postId;
        this.creationDateTime = timeUtils.getCurrentDate();
        this.pageNumber = pageNumber;
        this.indexPageNumber = indexPageNumber;
        this.priceNumber = null;
        this.priceDisplay = null;
        this.courseURLCourseName = courseURLCourseName;
        this.udemyURLCourseName = null;
        this.type = isSingleCourse ? CourseTypeEnum.SINGLE : CourseTypeEnum.COURSES_LIST;
        this.isFree = isFree;
        this.courseURL = courseURL;
        this.udemyURL = udemyURL;
        this.udemyURLCompare = udemyURLCompare;
        this.couponKey = couponKey;
        this.status = CourseStatusEnum.CREATE;
        this.resultDateTime = null;
        this.resultDetails = [];
    }
}

module.exports = CourseDataModel;