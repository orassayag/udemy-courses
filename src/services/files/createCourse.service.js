const courseService = require('./course.service');
const puppeteerService = require('./puppeteer.service');
const { Status } = require('../../core/enums');

class CreateCourseService {

    constructor() { }

    async createCourses() {
        // create courses.
        let isErrorInARow = await puppeteerService.createCourses();
        if (isErrorInARow) {
            return Status.CREATE_UPDATE_ERROR_IN_A_ROW;
        }
        return null;
    }

    createSessionCourses(urls) {
        courseService.createSessionCourses(urls);
    }
}

module.exports = new CreateCourseService();