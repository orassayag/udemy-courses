const { StatusEnum } = require('../../core/enums');
const courseService = require('./course.service');
const puppeteerService = require('./puppeteer.service');

class CreateCourseService {

    constructor() { }

    async createCourses() {
        // Create courses.
        if (await puppeteerService.createCourses()) {
            return StatusEnum.CREATE_UPDATE_ERROR_IN_A_ROW;
        }
        return null;
    }

    createSessionCourses(urls) {
        courseService.createSessionCourses(urls);
    }
}

module.exports = new CreateCourseService();