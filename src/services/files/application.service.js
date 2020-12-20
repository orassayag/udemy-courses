const { ApplicationData } = require('../../core/models');

class ApplicationService {

    constructor() {
        this.applicationData = null;
    }

    initiate(settings, status, mode) {
        this.applicationData = new ApplicationData({
            settings: settings,
            status: status,
            mode: mode
        });
    }
}

module.exports = new ApplicationService();