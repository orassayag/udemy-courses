import { StatusEnum } from '../../core/enums/index.js';
import courseService from './course.service.js';
import puppeteerService from './puppeteer.service.js';

class CreateCourseService {
  constructor() {}

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
