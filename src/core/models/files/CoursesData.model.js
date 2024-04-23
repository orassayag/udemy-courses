import { CourseStatusEnum } from '../../enums/index.js';

class CoursesDataModel {
  constructor() {
    this.coursesList = [];
    this.totalPurchasedCount = 0;
    this.totalCoursesPriceNumber = 0;
    this.totalPurchasePriceNumber = 0;
    this.totalCreateCoursesCount = 0;
    this.totalPagesCount = 0;
    this.totalSingleCount = 0;
    this.totalCourseListCount = 0;
    this.courseIndex = null;
    this.courseDataModel = null;
    const keysList = Object.values(CourseStatusEnum);
    for (let i = 0; i < keysList.length; i++) {
      this[`${keysList[i]}Count`] = 0;
    }
  }

  updateCount(isAdd, counterName, count) {
    const fieldName = `${counterName}Count`;
    if (Object.prototype.hasOwnProperty.call(this, fieldName)) {
      if (isAdd) {
        this[fieldName] += count;
      } else {
        this[fieldName] -= count;
        if (this[fieldName] <= 1) {
          return 0;
        }
      }
    }
  }
}

export default CoursesDataModel;
