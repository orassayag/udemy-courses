import { ApplicationDataModel } from '../../core/models/index.js';

class ApplicationService {
  constructor() {
    this.applicationDataModel = null;
  }

  initiate(data) {
    this.applicationDataModel = new ApplicationDataModel(data);
  }
}

export default new ApplicationService();
