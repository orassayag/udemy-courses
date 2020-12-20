const courseService = require('./course.service');
const logService = require('./log.service');
const puppeteerService = require('./puppeteer.service');
const { CourseStatus } = require('../../core/enums');

class PurchaseCoursesService {

    constructor() { }

    async purchaseCourses() {
        // Purchase courses.
        const purchaseCoursesResult = await puppeteerService.purchaseCourses();
        // Log the courses.
        await this.logCourses();
        if (purchaseCoursesResult) {
            return purchaseCoursesResult;
        }
        return null;
    }

    async logCourses() {
        for (let i = 0; i < courseService.coursesData.coursesList.length; i++) {
            const course = courseService.coursesData.coursesList[i];
            await logService.logCourse({
                course: course,
                isValid: course.status === CourseStatus.PURCHASE
            });
        }
    }
}

module.exports = new PurchaseCoursesService();