import { ApplicationDataModel } from '../../core/models';

class ApplicationService {

    constructor() {
        this.applicationDataModel = null;
    }

    initiate(data) {
        this.applicationDataModel = new ApplicationDataModel(data);
    }
}

export default new ApplicationService();