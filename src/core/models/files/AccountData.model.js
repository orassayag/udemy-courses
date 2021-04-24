class AccountDataModel {

    constructor(settings) {
        // Set the parameters from the settings file.
        const { ACCOUNT_FILE_PATH } = settings;
        this.accountFilePath = ACCOUNT_FILE_PATH;
        this.email = null;
        this.password = null;
        this.asterixsPassword = null;
    }
}

module.exports = AccountDataModel;