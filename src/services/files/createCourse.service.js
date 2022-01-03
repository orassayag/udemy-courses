import { StatusEnum } from '../../core/enums';
import courseService from './course.service';
import puppeteerService from './puppeteer.service';

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

export default new CreateCourseService();