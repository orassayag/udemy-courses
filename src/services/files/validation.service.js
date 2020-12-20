const isReachable = require('is-reachable');
const applicationService = require('./application.service');

class ValidationService {

    constructor() { }

    async validateURLs() {
        const urls = [applicationService.applicationData.coursesBaseURL, applicationService.applicationData.udemyBaseURL];
        for (let i = 0; i < urls.length; i++) {
            await this.validateURL(urls[i]);
        }
    }

    async validateURL(url) {
        let isConnected = true;
        try {
            isConnected = await isReachable(url);
        } catch (error) { isConnected = false; }
        if (!isConnected) {
            throw new Error(`${url} is not available (1000021)`);
        }
    }
}

module.exports = new ValidationService();