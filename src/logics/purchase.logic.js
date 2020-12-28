const settings = require('../settings/settings');
const { accountService, applicationService, confirmationService, countLimitService, courseService,
    createCourseService, logService, pathService, puppeteerService, purchaseCourseService,
    updateCourseService, validationService } = require('../services');
const { Color, Method, Mode, Status } = require('../core/enums');
const { logUtils, systemUtils } = require('../utils');
const globalUtils = require('../utils/files/global.utils');

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
        courseService.initiate(logService.logCourse.bind(logService));
    }

    async validateGeneralSettings() {
        logUtils.logMagentaStatus('VALIDATE GENERAL SETTINGS');
        // Validate methods.
        if (!applicationService.applicationData.isCreateCoursesMethodActive) {
            this.exit(Status.INVALID_METHOD, Color.RED);
        }
        // Validate internet connection works.
        await validationService.validateURLs();
    }

    async startSession(urls) {
        // Initiate.
        if (applicationService.applicationData.mode === Mode.SESSION) {
            createCourseService.createSessionCourses(urls);
            const purchaseCoursesResult = await purchaseCourseService.purchaseCourses();
            if (purchaseCoursesResult) {
                await this.exit(purchaseCoursesResult, Color.RED);
            }
            await this.exit(Status.FINISH, Color.GREEN);
        }
        else {
            applicationService.applicationData.startDateTime = new Date();
            logService.startLogProgress();
            if (applicationService.applicationData.isCreateCoursesMethodActive) {
                this.setApplicationMethod(Method.CREATE_COURSES);
                const createCoursesResult = await createCourseService.createCourses();
                if (createCoursesResult) {
                    await this.exit(createCoursesResult, Color.RED);
                }
            }
            if (applicationService.applicationData.isUpdateCoursesMethodActive) {
                this.setApplicationMethod(Method.UPDATE_COURSES);
                const updateCoursesResult = await updateCourseService.updateCourses();
                if (updateCoursesResult) {
                    await this.exit(updateCoursesResult, Color.RED);
                }
            }
            if (applicationService.applicationData.isPurchaseCoursesMethodActive) {
                this.setApplicationMethod(Method.PURCHASE_COURSES);
                const purchaseCoursesResult = await purchaseCourseService.purchaseCourses();
                if (purchaseCoursesResult) {
                    await this.exit(purchaseCoursesResult, Color.RED);
                }
            }
        }
        await this.exit(Status.FINISH, Color.GREEN);
    }

    setApplicationMethod(method) {
        applicationService.applicationData.method = method;
        courseService.coursesData.courseIndex = 0;
    }

    // Let the user confirm all the IMPORTANT settings before the process start.
    async confirm() {
        if (!await confirmationService.confirm(settings)) {
            this.exit(Status.ABORT_BY_THE_USER, Color.RED);
        }
    }

    async exit(status, color) {
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
            if (countLimitService.countLimitData) {
                await globalUtils.sleep(countLimitService.countLimitData.millisecondsTimeoutExitApplication);
            }
            logService.close();
        }
        systemUtils.exit(status, color);
    }
}

module.exports = PurchaseLogic;