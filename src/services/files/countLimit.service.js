import { CountLimitDataModel } from '../../core/models/index.js';

class CountLimitService {
  constructor() {
    this.countLimitDataModel = null;
  }

  initiate(settings) {
    this.countLimitDataModel = new CountLimitDataModel(settings);
  }
}

export default new CountLimitService();
