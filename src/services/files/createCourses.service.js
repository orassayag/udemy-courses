const courseService = require('./course.service');
const logService = require('./log.service');
const puppeteerService = require('./puppeteer.service');
const { CourseStatus, Status } = require('../../core/enums');

class CreateCoursesService {

    constructor() { }

    async createCourses() {
        // Get courses.
        let isErrorInARow = await puppeteerService.createCourses();
        if (isErrorInARow) {
            return Status.GET_ERROR_IN_A_ROW;
        }
        // Get single courses data.
        isErrorInARow = await puppeteerService.updateCoursesData();
        if (isErrorInARow) {
            return Status.GET_ERROR_IN_A_ROW;
        }
        // Validate the courses.
        const finalizeResult = await courseService.finalizeGetCourses();
        // Log the courses.
        await this.logCourses();
        if (finalizeResult) {
            return finalizeResult;
        }
        return null;
    }

    createSessionCourses(urls) {
        courseService.createSessionCourses(urls);
    }

    async logCourses() {
        for (let i = 0; i < courseService.coursesData.coursesList.length; i++) {
            const course = courseService.coursesData.coursesList[i];
            await logService.logCourse({
                course: course,
                isValid: course.status === CourseStatus.CREATE
            });
        }
    }
}

module.exports = new CreateCoursesService();