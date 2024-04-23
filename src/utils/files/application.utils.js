import { EnvironmentEnum } from '../../core/enums/index.js';

class ApplicationUtils {
  constructor() {}

  getApplicationEnvironment(isProductionEnvironment) {
    return isProductionEnvironment
      ? EnvironmentEnum.PRODUCTION
      : EnvironmentEnum.DEVELOPMENT;
  }
}

export default new ApplicationUtils();
