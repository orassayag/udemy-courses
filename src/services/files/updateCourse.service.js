const { StatusEnum } = require('../../core/enums');
const courseService = require('./course.service');
const puppeteerService = require('./puppeteer.service');

class UpdateCourseService {

    constructor() { }

    async updateCourses() {
        // Update single courses data.
        if (await puppeteerService.updateCoursesData()) {
            return StatusEnum.CREATE_UPDATE_ERROR_IN_A_ROW;
        }
        // Validate the courses.
        return await courseService.finalizeCreateUpdateCourses();
    }
}

module.exports = new UpdateCourseService();