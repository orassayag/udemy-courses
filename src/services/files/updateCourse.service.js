import { StatusEnum } from '../../core/enums/index.js';
import courseService from './course.service.js';
import puppeteerService from './puppeteer.service.js';

class UpdateCourseService {
  constructor() {}

  async updateCourses() {
    // Update single courses data.
    if (await puppeteerService.updateCoursesData()) {
      return StatusEnum.CREATE_UPDATE_ERROR_IN_A_ROW;
    }
    // Validate the courses.
    return await courseService.finalizeCreateUpdateCourses();
  }
}

export default new UpdateCourseService();
