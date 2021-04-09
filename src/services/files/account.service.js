const { AccountData } = require('../../core/models');
const fileService = require('./file.service');
const { applicationUtils, textUtils, validationUtils } = require('../../utils');

class AccountService {

    constructor() {
        this.accountData = null;
    }

    async initiate(settings) {
        this.accountData = new AccountData(settings);
        const account = await fileService.getJSONFileData({
            environment: applicationUtils.getApplicationEnvironment(settings.IS_PRODUCTION_ENVIRONMENT),
            path: this.accountData.accountFilePath,
            parameterName: 'accountFilePath',
            fileExtension: '.json'
        });
        if (!validationUtils.isExists(account)) {
            throw new Error('No accounts found in the JSON file (1000035)');
        }
        if (!validationUtils.isPropertyExists(account[0], 'email')) {
            throw new Error('Missing email parameter (1000036)');
        }
        if (!validationUtils.isPropertyExists(account[0], 'password')) {
            throw new Error('Missing password parameter (1000037)');
        }
        const { email, password } = account[0];
        const validationResult = this.validateAccount({
            email: email,
            password: password
        });
        this.accountData.email = validationResult.email;
        this.accountData.password = validationResult.password;
        this.accountData.asterixsPassword = textUtils.getAsteriskCharactersString(validationResult.password.length);
    }

    validateAccount(data) {
        let { email, password } = data;
        if (!email) {
            throw new Error('Missing email account (1000003)');
        }
        if (!validationUtils.isValidEmailAddress(textUtils.toLowerCase(email))) {
            throw new Error('Invalid email account (1000004)');
        }
        if (!password) {
            throw new Error('Missing password account (1000005)');
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