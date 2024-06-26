import settings from '../settings/settings.js';
import {
  accountService,
  applicationService,
  confirmationService,
  countLimitService,
  courseService,
  createCourseService,
  logService,
  pathService,
  puppeteerService,
  purchaseCourseService,
  updateCourseService,
  validationService,
} from '../services/index.js';
import {
  ColorEnum,
  MethodEnum,
  ModeEnum,
  StatusEnum,
} from '../core/enums/index.js';
import globalUtils from '../utils/files/global.utils.js';
import {
  logUtils,
  systemUtils,
  timeUtils,
  validationUtils,
} from '../utils/index.js';

class PurchaseLogic {
  constructor() {}

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
    this.updateStatus('INITIATE THE SERVICES', StatusEnum.INITIATE);
    countLimitService.initiate(settings);
    applicationService.initiate({
      settings: settings,
      status: StatusEnum.INITIATE,
    });
    pathService.initiate(settings);
    puppeteerService.initiate();
    logService.initiate(settings);
    courseService.initiate(logService.logCourse.bind(logService));
  }

  async validateGeneralSettings() {
    this.updateStatus('VALIDATE GENERAL SETTINGS', StatusEnum.VALIDATE);
    // Validate methods.
    if (!applicationService.applicationDataModel.isCreateCoursesMethodActive) {
      await this.exit(StatusEnum.INVALID_METHOD, ColorEnum.RED);
    }
    // Validate that the internet connection works.
    await validationService.validateURLs();
  }

  async startSession(urls) {
    // Initiate.
    if (applicationService.applicationDataModel.mode === ModeEnum.SESSION) {
      if (!validationUtils.isExists(urls)) {
        await this.exit(StatusEnum.FINISH, ColorEnum.GREEN);
      }
      createCourseService.createSessionCourses(urls);
      const purchaseCoursesResult =
        await purchaseCourseService.purchaseCourses();
      if (purchaseCoursesResult) {
        await this.exit(purchaseCoursesResult, ColorEnum.RED);
      }
      await this.exit(StatusEnum.FINISH, ColorEnum.GREEN);
    } else {
      applicationService.applicationDataModel.startDateTime =
        timeUtils.getCurrentDate();
      logService.startLogProgress();
      if (applicationService.applicationDataModel.isCreateCoursesMethodActive) {
        this.setApplicationMethod(MethodEnum.CREATE_COURSES);
        const createCoursesResult = await createCourseService.createCourses();
        if (createCoursesResult) {
          await this.exit(createCoursesResult, ColorEnum.RED);
        }
      }
      if (applicationService.applicationDataModel.isUpdateCoursesMethodActive) {
        this.setApplicationMethod(MethodEnum.UPDATE_COURSES);
        const updateCoursesResult = await updateCourseService.updateCourses();
        if (updateCoursesResult) {
          await this.exit(updateCoursesResult, ColorEnum.RED);
        }
      }
      if (
        applicationService.applicationDataModel.isPurchaseCoursesMethodActive
      ) {
        this.setApplicationMethod(MethodEnum.PURCHASE_COURSES);
        const purchaseCoursesResult =
          await purchaseCourseService.purchaseCourses();
        if (purchaseCoursesResult) {
          await this.exit(purchaseCoursesResult, ColorEnum.RED);
        }
      }
    }
    await this.exit(StatusEnum.FINISH, ColorEnum.GREEN);
  }

  setApplicationMethod(method) {
    applicationService.applicationDataModel.method = method;
    courseService.coursesDataModel.courseIndex = 0;
  }

  // Let the user confirm all the IMPORTANT settings before the process starts.
  async confirm() {
    if (!(await confirmationService.confirm(settings))) {
      await this.exit(StatusEnum.ABORT_BY_THE_USER, ColorEnum.RED);
    }
  }

  updateStatus(text, status) {
    logUtils.logMagentaStatus(text);
    if (applicationService.applicationDataModel) {
      applicationService.applicationDataModel.status = status;
    }
  }

  async exit(status, color) {
    if (applicationService.applicationDataModel) {
      applicationService.applicationDataModel.status = status;
      if (countLimitService.countLimitDataModel) {
        await globalUtils.sleep(
          countLimitService.countLimitDataModel
            .millisecondsTimeoutExitApplication
        );
      }
      logService.close();
    }
    systemUtils.exit(status, color);
  }
}

export default PurchaseLogic;
