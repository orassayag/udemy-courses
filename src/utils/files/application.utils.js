import { EnvironmentEnum } from '../../core/enums';

class ApplicationUtils {

    constructor() { }

    getApplicationEnvironment(isProductionEnvironment) {
        return isProductionEnvironment ? EnvironmentEnum.PRODUCTION : EnvironmentEnum.DEVELOPMENT;
    }
}

export default new ApplicationUtils();