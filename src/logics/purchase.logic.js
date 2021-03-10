const settings = require('../settings/settings');
const { accountService, applicationService, confirmationService, countLimitService,
    courseService, createCourseService, logService, pathService, puppeteerService,
    purchaseCourseService, updateCourseService, validationService } = require('../services');
const { Color, Method, Mode, Status } = require('../core/enums');
const { logUtils, systemUtils, validationUtils } = require('../utils');
const globalUtils = require('../utils/files/global.utils');

class PurchaseLogic {

    constructor() { }

    async run(urls) {
        // Initiate the account service first.
        await accountService.initiate(settings);
        // Validate all settings that fit the user's needs.
        await this.confirm();
        // Initiate all the settings, configurations, services, etc...
        this.initiate();
        // Validate general settings.
        await this.validateGeneralSettings();
        // Start the purchase courses processes.
        await this.startSession(urls);
    }

    initiate() {
        this.updateStatus('INITIATE THE SERVICES', Status.INITIATE);
        countLimitService.initiate(settings);
        applicationService.initiate({
            settings: settings,
            coursesDatesResult: this.validateCoursesDatesValue(settings.COURSES_DATES_VALUE),
            status: Status.INITIATE
        });
        pathService.initiate(settings);
        puppeteerService.initiate();
        logService.initiate(settings);
        courseService.initiate(logService.logCourse.bind(logService));
    }

    validateCoursesDatesValue(coursesDatesValue) {
        const coursesDatesResult = courseService.validateCoursesDatesValue(coursesDatesValue);
        if (coursesDatesResult.coursesError) {
            throw new Error(coursesDatesResult.coursesError);
        }
        return coursesDatesResult;
    }

    async validateGeneralSettings() {
        this.updateStatus('VALIDATE GENERAL SETTINGS', Status.VALIDATE);
        // Validate methods.
        if (!applicationService.applicationData.isCreateCoursesMethodActive) {
            this.exit(Status.INVALID_METHOD, Color.RED);
        }
        // Validate that the internet connection works.
        await validationService.validateURLs();
    }

    async startSession(urls) {
        // Initiate.
        if (applicationService.applicationData.mode === Mode.SESSION) {
            if (!validationUtils.isExists(urls)) {
                await this.exit(Status.FINISH, Color.GREEN);
            }
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

    // Let the user confirm all the IMPORTANT settings before the process starts.
    async confirm() {
        if (!await confirmationService.confirm(settings)) {
            this.exit(Status.ABORT_BY_THE_USER, Color.RED);
        }
    }

    updateStatus(text, status) {
        logUtils.logMagentaStatus(text);
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
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