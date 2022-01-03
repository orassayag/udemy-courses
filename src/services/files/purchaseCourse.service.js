import puppeteerService from './puppeteer.service';

class PurchaseCourseService {

    constructor() { }

    async purchaseCourses() {
        // Purchase courses.
        return await puppeteerService.purchaseCourses();
    }
}

export default new PurchaseCourseService();