const { AccountDataModel } = require('../../core/models');
const fileService = require('./file.service');
const { applicationUtils, textUtils, validationUtils } = require('../../utils');

class AccountService {

    constructor() {
        this.accountDataModel = null;
    }

    async initiate(settings) {
        this.accountDataModel = new AccountDataModel(settings);
        const account = await fileService.getJSONFileData({
            environment: applicationUtils.getApplicationEnvironment(settings.IS_PRODUCTION_ENVIRONMENT),
            path: this.accountDataModel.accountFilePath,
            parameterName: 'accountFilePath',
            fileExtension: '.json'
        });
        if (!validationUtils.isExists(account)) {
            throw new Error('No accounts found in the JSON file (1000003)');
        }
        if (!validationUtils.isPropertyExists(account[0], 'email')) {
            throw new Error('Missing email parameter (1000004)');
        }
        if (!validationUtils.isPropertyExists(account[0], 'password')) {
            throw new Error('Missing password parameter (1000005)');
        }
        const { email, password } = account[0];
        const validationResult = this.validateAccount({
            email: email,
            password: password
        });
        this.accountDataModel.email = validationResult.email;
        this.accountDataModel.password = validationResult.password;
        this.accountDataModel.asterixsPassword = textUtils.getAsteriskCharactersString(validationResult.password.length);
    }

    validateAccount(data) {
        let { email, password } = data;
        if (!email) {
            throw new Error('Missing email account (1000006)');
        }
        if (!validationUtils.isValidEmailAddress(textUtils.toLowerCase(email))) {
            throw new Error('Invalid email account (1000007)');
        }
        if (!password) {
            throw new Error('Missing password account (1000008)');
        }
        email = email.trim();
        password = password.trim();
        return {
            email: email,
            password: password
        };
    }
}

module.exports = new AccountService();