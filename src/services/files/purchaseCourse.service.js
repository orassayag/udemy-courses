import puppeteerService from './puppeteer.service.js';

class PurchaseCourseService {
  constructor() {}

  async purchaseCourses() {
    // Purchase courses.
    return await puppeteerService.purchaseCourses();
  }
}

export default new PurchaseCourseService();
