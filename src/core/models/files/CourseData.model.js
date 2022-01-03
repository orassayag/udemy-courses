import { CourseStatusEnum, CourseTypeEnum } from '../../enums';
import { timeUtils } from '../../../utils';

class CourseDataModel {

    constructor(data) {
        const { id, postId, pageNumber, indexPageNumber, courseURL, udemyURL,
            udemyURLCompare, couponKey, courseURLCourseName, isSingleCourse } = data;
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
        this.isFree = false;
        this.languageName = null;
        this.courseURL = courseURL;
        this.udemyURL = udemyURL;
        this.udemyURLCompare = udemyURLCompare;
        this.couponKey = couponKey;
        this.status = CourseStatusEnum.CREATE;
        this.resultDateTime = null;
        this.resultDetails = [];
    }
}

export default CourseDataModel;