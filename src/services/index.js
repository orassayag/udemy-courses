const accountService = require('./files/account.service');
const applicationService = require('./files/application.service');
const confirmationService = require('./files/confirmation.service');
const countLimitService = require('./files/countLimit.service');
const courseService = require('./files/course.service');
const createCoursesService = require('./files/createCourses.service');
const domService = require('./files/dom.service');
const fileService = require('./files/file.service');
const logService = require('./files/log.service');
const pathService = require('./files/path.service');
const puppeteerService = require('./files/puppeteer.service');
const purchaseCoursesService = require('./files/purchaseCourses.service');
const validationService = require('./files/validation.service');

module.exports = {
    accountService, applicationService, confirmationService, countLimitService, createCoursesService,
    courseService, domService, fileService, logService, pathService, puppeteerService, purchaseCoursesService,
    validationService
};