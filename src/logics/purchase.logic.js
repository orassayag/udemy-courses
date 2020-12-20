const settings = require('../settings/settings');
const { accountService, applicationService, confirmationService, countLimitService, courseService,
    createCoursesService, logService, pathService, puppeteerService, purchaseCoursesService,
    validationService } = require('../services');
const { Color, Method, Mode, Status } = require('../core/enums');
const { logUtils, systemUtils } = require('../utils');

class PurchaseLogic {

    constructor() { }

    async run(data) {
        // Initiate the account service first.
        await accountService.initiate(settings);
        // Validate all settings are fit to the user needs.
        await this.confirm();
        // Initiate all the settings, configurations, services, ect.
        await this.initiate(data.mode);
        // Validate general settings.
        await this.validateGeneralSettings();
        // Start the sending emails processes.
        await this.startSession(data.urls);
    }

    async initiate(mode) {
        logUtils.logMagentaStatus('INITIATE THE SERVICES');
        applicationService.initiate(settings, Status.INITIATE, mode);
        countLimitService.initiate(settings);
        pathService.initiate(settings);
        puppeteerService.initiate();
        await logService.initiate(settings);
        courseService.initiate();
    }

    async validateGeneralSettings() {
        logUtils.logMagentaStatus('VALIDATE GENERAL SETTINGS');
        // Validate methods.
        if (!applicationService.applicationData.isGetCoursesMethodActive) {
            this.exit(Status.INVALID_METHOD, Color.RED);
        }
        // Validate internet connection works.
        await validationService.validateURLs();
    }

    async startSession(urls) {
        // Initiate.
        if (applicationService.applicationData.mode === Mode.SESSION) {
            createCoursesService.createSessionCourses(urls);
            const purchaseCoursesResult = await purchaseCoursesService.purchaseCourses();
            if (purchaseCoursesResult) {
                this.exit(purchaseCoursesResult, Color.RED);
            }
            this.exit(Status.FINISH, Color.GREEN);
        }
        else {
            applicationService.applicationData.startDateTime = new Date();
            if (!applicationService.applicationData.isLogMode) {
                logService.startLogProgress();
            }
            if (applicationService.applicationData.isGetCoursesMethodActive) {
                applicationService.applicationData.method = Method.GET_COURSES;
                const createCoursesResult = await createCoursesService.createCourses();
                if (createCoursesResult) {
                    this.exit(createCoursesResult, Color.RED);
                }
            }
            if (applicationService.applicationData.isPurchaseCoursesMethodActive) {
                applicationService.applicationData.method = Method.PURCHASE_COURSES;
                const purchaseCoursesResult = await purchaseCoursesService.purchaseCourses();
                if (purchaseCoursesResult) {
                    this.exit(purchaseCoursesResult, Color.RED);
                }
            }
        }
        this.exit(Status.FINISH, Color.GREEN);
    }

    // Let the user confirm all the IMPORTANT settings before the process start.
    async confirm() {
        if (!await confirmationService.confirm(settings)) {
            this.exit(Status.ABORT_BY_THE_USER, Color.RED);
        }
    }

    exit(status, color) {
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
            logService.close();
        }
        systemUtils.exit(status, color);
    }
}

module.exports = PurchaseLogic;