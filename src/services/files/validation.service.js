import isReachable from 'is-reachable';
import applicationService from './application.service.js';
import countLimitService from './countLimit.service.js';
import globalUtils from '../../utils/files/global.utils.js';

class ValidationService {
  constructor() {}

  async validateURLs() {
    const urls = [
      applicationService.applicationDataModel.coursesBaseURL,
      applicationService.applicationDataModel.udemyBaseURL,
    ];
    for (let i = 0; i < urls.length; i++) {
      await this.validateURL(urls[i]);
    }
  }

  async validateURL(url) {
    let isConnected = true;
    for (
      let i = 0;
      i < countLimitService.countLimitDataModel.maximumURLValidationCount;
      i++
    ) {
      try {
        isConnected = await isReachable(url);
      } catch (error) {
        isConnected = false;
      }
      if (isConnected) {
        break;
      } else {
        await globalUtils.sleep(
          countLimitService.countLimitDataModel.millisecondsTimeoutURLValidation
        );
      }
    }
    if (!isConnected) {
      throw new Error(`${url} is not available (1000023)`);
    }
  }
}

export default new ValidationService();
