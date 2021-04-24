const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { CrawlResultModel } = require('../../core/models');
const { ColorEnum, CourseStatusEnum, ModeEnum, StatusEnum } = require('../../core/enums');
const accountService = require('./account.service');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const courseService = require('./course.service');
const domService = require('./dom.service');
const globalUtils = require('../../utils/files/global.utils');
const { courseUtils, crawlUtils, logUtils, systemUtils, validationUtils } = require('../../utils');

class PuppeteerService {

    constructor() {
        this.purchaseErrorInARowCount = null;
        this.timeout = null;
        this.pageOptions = null;
        this.waitForFunction = null;
        this.isPlannedClose = null;
    }

    initiate() {
        this.purchaseErrorInARowCount = 0;
        puppeteerExtra.use(pluginStealth());
        this.timeout = countLimitService.countLimitDataModel.millisecondsTimeoutSourceRequestCount;
        this.pageOptions = {
            waitUntil: 'networkidle2',
            timeout: this.timeout
        };
        this.waitForFunction = 'document.querySelector("body")';
    }

    async initiateCrawl(isDisableAsserts) {
        const crawlResultModel = new CrawlResultModel();
        // Set the browser.
        this.isPlannedClose = false;
        const browser = await puppeteerExtra.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--start-maximized',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });
        const pid = browser.process().pid;
        browser.on('disconnected', () => {
            systemUtils.killProcess(pid);
            if (!this.isPlannedClose) {
                systemUtils.exit(StatusEnum.BROWSER_CLOSE, ColorEnum.RED, 0);
            }
        });
        process.on('SIGINT', () => {
            this.close(browser, true);
        });
        // Set the page and close the first empty tab.
        const page = await browser.newPage();
        const pages = await browser.pages();
        if (pages.length > 1) {
            await pages[0].close();
        }
        await page.setRequestInterception(true);
        await page.setJavaScriptEnabled(false);
        await page.setDefaultNavigationTimeout(this.timeout);
        page.on('request', (request) => {
            if (isDisableAsserts && ['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });
        crawlResultModel.page = page;
        crawlResultModel.browser = browser;
        return crawlResultModel;
    }

    async createCourses() {
        let isErrorInARow = false;
        // Check if to scan a specific page or all pages.
        const isSpecificPage = applicationService.applicationDataModel.specificCoursesPageNumber &&
            validationUtils.isPositiveNumber(applicationService.applicationDataModel.specificCoursesPageNumber) &&
            applicationService.applicationDataModel.specificCoursesPageNumber < countLimitService.countLimitDataModel.maximumPagesNumber;
        const { browser, page } = await this.initiateCrawl(true);
        try {
            // Go to the courses from single URLs.
            for (let i = 0; i < applicationService.applicationDataModel.pagesCount; i++) {
                applicationService.applicationDataModel.status = StatusEnum.CREATE_COURSES;
                const pageNumber = isSpecificPage ? applicationService.applicationDataModel.specificCoursesPageNumber : i + 1;
                const url = `${applicationService.applicationDataModel.coursesBaseURL}/page/${pageNumber}/`;
                await page.goto(url, this.pageOptions);
                await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
                const mainContent = await page.content();
                // Create all the courses from the main page with pagination.
                const coursesResult = await domService.createSingleCourses({
                    mainContent: mainContent,
                    pageNumber: pageNumber,
                    indexPageNumber: i
                });
                if (coursesResult.isErrorInARow) {
                    isErrorInARow = true;
                    break;
                }
                if (!coursesResult.coursesCount) {
                    break;
                }
                courseService.coursesDataModel.totalPagesCount += 1;
                courseService.coursesDataModel.totalCreateCoursesCount += coursesResult.coursesCount;
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesMainPages);
                applicationService.applicationDataModel.status = StatusEnum.PAUSE;
                if (isSpecificPage) {
                    break;
                }
            }
        }
        catch (error) {
            logUtils.log(error);
        }
        await this.close(browser, true);
        return isErrorInARow;
    }

    async updateCoursesData() {
        let isErrorInARow = false;
        const { browser, page } = await this.initiateCrawl(true);
        try {
            // Loop on the course URL to get the course full data.
            const originalCoursesCount = courseService.coursesDataModel.coursesList.length;
            for (let i = 0; i < originalCoursesCount; i++) {
                applicationService.applicationDataModel.status = StatusEnum.UPDATE_COURSES;
                courseService.coursesDataModel.courseIndex = i + 1;
                const courseDataModel = courseService.coursesDataModel.coursesList[i];
                await page.goto(courseDataModel.courseURL, this.pageOptions);
                await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
                const postContent = await page.content();
                isErrorInARow = await domService.createCourseFullData({
                    courseDataModel: courseDataModel,
                    courseIndex: i,
                    courseContent: postContent
                });
                if (isErrorInARow) {
                    break;
                }
            }
        }
        catch (error) {
            logUtils.log(error);
        }
        await this.close(browser, true);
        return isErrorInARow;
    }

    async purchaseCourses() {
        const initiateCrawl = await this.initiateCrawl(false);
        // Login to Udemy.
        const afterLogin = await this.udemyLogin(initiateCrawl);
        if (afterLogin.exitReason) {
            return afterLogin.exitReason;
        }
        // Purchase courses.
        const afterPurchase = await this.udemyPurchases(afterLogin);
        // Logout from Udemy.
        const afterLogout = await this.udemyLogout(afterPurchase);
        if (afterLogout.exitReason) {
            return afterLogout.exitReason;
        }
        return null;
    }

    async udemyLogin(data) {
        const crawlResultModel = new CrawlResultModel();
        // Login to Udemy.
        applicationService.applicationDataModel.status = StatusEnum.LOGIN;
        const { browser, page } = data;
        try {
            let pageLoaded = false;
            let isPasswordRequiredOnly = false;
            for (let i = 0; i < countLimitService.countLimitDataModel.maximumUdemyLoginAttemptsCount; i++) {
                // If no match for the email or password inputs, the page usually goes to
                // 'Prove you are human' or 'Your browser is too old' pages. Changing the user agent
                // and reloading the page should solve this issue.
                if (!await page.$(domService.loginEmailDOM) && !await page.$(domService.loginPasswordDOM)) {
                    await page.goto(applicationService.applicationDataModel.udemyLoginURL, this.pageOptions);
                    await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
                }
                else if (!await page.$(domService.loginEmailDOM)) {
                    isPasswordRequiredOnly = true;
                    pageLoaded = true;
                }
                else {
                    pageLoaded = true;
                    break;
                }
                if (!pageLoaded && i > 0) {
                    await this.sleepAction();
                    await page.setUserAgent(crawlUtils.getRandomUserAgent());
                }
            }
            // If pages didn't load after a number of attempts to reload, exit the program.
            if (!pageLoaded) {
                await this.close(browser, true);
                crawlResultModel.exitReason = StatusEnum.LOGIN_FAILED;
                return crawlResultModel;
            }
            // Insert credentials and click login.
            await this.sleepAction();
            if (!isPasswordRequiredOnly) {
                await page.$eval(domService.loginEmailDOM, (el, value) => el.value = value, accountService.accountDataModel.email);
                await this.sleepAction();
            }
            await page.$eval(domService.loginPasswordDOM, (el, value) => el.value = value, accountService.accountDataModel.password);
            await this.sleepAction();
            await page.click(domService.loginButtonDOM);
            // After successful login, turn on JavaScript in order to see all options.
            await page.setJavaScriptEnabled(true);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepAction();
            // Validate login was successful.
            if (await page.$(domService.loginErrorDOM) || await page.$(domService.signInHeaderDOM)) {
                await this.close(browser, true);
                crawlResultModel.exitReason = StatusEnum.LOGIN_LOAD_FAILED;
                return crawlResultModel;
            }
            await this.sleepAction();
        }
        catch (error) {
            logUtils.log(error);
        }
        crawlResultModel.page = page;
        crawlResultModel.browser = browser;
        return crawlResultModel;
    }

    async udemyPurchases(data) {
        for (let i = 1; i <= countLimitService.countLimitDataModel.maximumSessionsCount; i++) {
            applicationService.applicationDataModel.sessionNumber = i;
            data = await this.udemyPurchasesSession(data);
            await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesPurchase);
        }
        return data;
    }

    async udemyPurchasesSession(data) {
        const crawlResultModel = new CrawlResultModel();
        // Purchase courses at Udemy.
        let { browser, page } = data;
        for (let i = 0; i < courseService.coursesDataModel.coursesList.length; i++) {
            applicationService.applicationDataModel.status = StatusEnum.PURCHASE;
            courseService.coursesDataModel.courseIndex = i + 1;
            const courseDataModel = courseService.coursesDataModel.coursesList[i];
            courseService.coursesDataModel.courseDataModel = courseDataModel;
            if (!courseDataModel || !courseDataModel.status) {
                continue;
            }
            // Validate course status.
            switch (courseDataModel.status) {
                case CourseStatusEnum.CREATE:
                case CourseStatusEnum.PURCHASE_ERROR:
                case CourseStatusEnum.FAIL: {
                    await globalUtils.sleep(10);
                    break;
                }
                default: { continue; }
            }
            // Validate course URL.
            if (!courseDataModel.udemyURL) {
                courseService.coursesDataModel.coursesList[i] = await courseService.updateCourseStatus({
                    courseDataModel: courseDataModel,
                    status: CourseStatusEnum.EMPTY_URL,
                    details: 'The udemyURL is empty.'
                });
                continue;
            }
            // Validate that page exists.
            if (!page) {
                crawlResultModel.page = page;
                crawlResultModel.browser = browser;
                crawlResultModel.exitReason = StatusEnum.UNEXPECTED_ERROR;
                return crawlResultModel;
            }
            // Purchase the course.
            const purchaseResult = await this.udemyPurchase({
                page: page,
                courseDataModel: courseDataModel
            });
            page = purchaseResult.page;
            courseService.coursesDataModel.coursesList[i] = purchaseResult.courseDataModel;
            courseService.coursesDataModel.courseDataModel = purchaseResult.courseDataModel;
            // Check if not error in a row.
            if (purchaseResult.isErrorInARow) {
                crawlResultModel.page = page;
                crawlResultModel.browser = browser;
                crawlResultModel.exitReason = StatusEnum.PURCHASE_ERROR_IN_A_ROW;
                return crawlResultModel;
            }
            // Check if not exceeded purchase count limit.
            if (this.checkPurchasedCount(purchaseResult.courseDataModel.status)) {
                return {
                    page: page,
                    browser: browser,
                    exitReason: StatusEnum.PURCHASE_LIMIT_EXCEEDED
                };
            }
            applicationService.applicationDataModel.status = StatusEnum.PAUSE;
            await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutBetweenCoursesPurchase);
        }
        crawlResultModel.page = page;
        crawlResultModel.browser = browser;
        return crawlResultModel;
    }

    async udemyPurchase(data) {
        const { page, courseDataModel } = data;
        try {
            this.logSessionURL(courseDataModel.udemyURL);
            await this.sleepAction();
            // Go to the course's page.
            await page.goto(courseDataModel.udemyURL, this.pageOptions);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepLoad();
            this.logSessionStage('LOAD');
            // Validate if page exists.
            if (await page.$(domService.courseNotExistsDOM)) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.PAGE_NOT_FOUND,
                    details: 'Course page does not found, no such course.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE EXISTS');
            // Validate if the course exists.
            if (await page.$(domService.courseLimitAccessDOM)) {
                let status = null;
                let details = null;
                const courseH2 = await page.$eval(domService.courseLimitAccessDOM, el => el.textContent);
                if (courseH2.indexOf('available') > -1) {
                    status = CourseStatusEnum.NOT_EXISTS;
                    details = 'The course is no longer available.';
                }
                if (courseH2.indexOf('enrollments') > -1) {
                    status = CourseStatusEnum.LIMIT_ACCESS;
                    details = 'The course is no longer accepting enrollments.';
                }
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: status,
                    details: details, originalPrices: null
                });
            }
            this.logSessionStage('PAGE NOT LIMIT ACCESS');
            // Validate if this is not course list suggestions.
            if (await page.$(domService.coursesSuggestListDOM)) {
                const courseH1 = await page.$eval(domService.coursesSuggestListDOM, el => el.textContent);
                const courseBackground = await page.$(domService.courseBackgroundDOM);
                if (!courseBackground && courseH1.indexOf('Courses') > -1) {
                    return await this.setCourseStatus({
                        page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.SUGGESTIONS_LIST,
                        details: 'Course page is not purchasable, it\'s a courses list suggestions page.', originalPrices: null
                    });
                }
            }
            this.logSessionStage('PAGE NOT SUGGESTIONS LIST');
            // Validate that course is not private.
            if (await page.$(domService.courseIsPrivateDOM)) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.PRIVATE,
                    details: 'Course page is private. It has lock icon button.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE NOT PRIVATE');
            // Validate that the enroll button exists.
            const enrollButton = await page.$(domService.courseEnrollButtonDOM);
            if (enrollButton) {
                const enrollButtonText = await page.$eval(domService.courseEnrollButtonDOM, el => el.textContent);
                if (enrollButtonText.indexOf('Go to course') > -1) {
                    return await this.setCourseStatus({
                        page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.ALREADY_PURCHASE,
                        details: 'The course already purchased in the past. No price label exists.', originalPrices: null
                    });
                }
            }
            else {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.ENROLL_NOT_EXISTS,
                    details: 'Can\'t purchase the course, because the enroll button not exists.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS ENROLL BUTTON');
            // Validate that the course is not already purchased.
            if (!await page.$(domService.coursePriceLabelDOM)) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.ALREADY_PURCHASE,
                    details: 'The course already purchased in the past. No price label exists.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS PRICE LABEL 1');
            const coursePriceLabel = await page.$eval(domService.coursePriceLabelDOM, el => el.textContent);
            if (!coursePriceLabel) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.ALREADY_PURCHASE,
                    details: 'The course already purchased in the past. No price label exists.', originalPrices: null
                });
            }
            this.logSessionStage('PAGE HAS PRICE LABEL 2');
            // Get the course original price.
            let originalPrices = null;
            if (await page.$(domService.courseOriginalPriceDOM)) {
                const courseOriginalPriceLabel = await page.$eval(domService.courseOriginalPriceDOM, el => el.textContent);
                if (courseOriginalPriceLabel) {
                    // Get the prices from the label and save them.
                    originalPrices = courseUtils.getCoursePrices(courseOriginalPriceLabel);
                }
            }
            this.logSessionStage('PAGE PASS ORIGINAL PRICE');
            // Validate that the course is free.
            if (coursePriceLabel.indexOf('Free') === -1) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.COURSE_PRICE_NOT_FREE,
                    details: 'The course price is not free. The keyword \'Free\' doesn\'t exists in the price label.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE HAS A FREE LABEL');
            // Enroll the course and go to the checkout page.
            await this.sleepAction();
            await page.evaluate((courseEnrollButtonDOM) => {
                document.querySelector(courseEnrollButtonDOM).click();
            }, domService.courseEnrollButtonDOM);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepLoad();
            this.logSessionStage('AFTER CLICK ENROLL BUTTON');
            // Possible that is a course without a checkout page. Validate it.
            if (await page.$(domService.purchaseSuccessDOM)) {
                // Course has no checkout page and has been purchased.
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.PURCHASE,
                    details: 'Course has been purchased successfully.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE NOT PURCHASED YET');
            // In the checkout page, Validate that price exists.
            if (!await page.$(domService.checkoutPriceDOM)) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.CHECKOUT_PRICE_NOT_EXISTS,
                    details: 'Course\'s price in the checkout page doesn\'t exists. No checkout price label exists.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE HAS CHECKOUT PRICE 1');
            // In the checkout page, Validate that the total price is 0.00.
            const checkoutPriceLabel = await page.$eval(domService.checkoutPriceDOM, el => el.textContent);
            if (!checkoutPriceLabel) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.CHECKOUT_PRICE_NOT_EXISTS,
                    details: 'Course\'s price in the checkout page doesn\'t exists. No checkout price label exists.', originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE HAS CHECKOUT PRICE 2');
            const { priceNumber } = courseUtils.getCoursePrices(checkoutPriceLabel);
            if (priceNumber > 0) {
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.CHECKOUT_PRICE_NOT_FREE,
                    details: `Course's priceNumber in checkout not equal to 0, but priceNumber equal to ${priceNumber}.`, originalPrices: originalPrices
                });
            }
            this.logSessionStage('PAGE CHECKOUT PRICE IS 0.00');
            // Purchase the course.
            await page.evaluate((purchaseButtonDOM) => {
                document.querySelector(purchaseButtonDOM).click();
            }, domService.purchaseButtonDOM);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepLoad();
            this.logSessionStage('AFTER PURCHASE BUTTON CLICK');
            // Validate purchase success.
            this.validateErrorInARow(false);
            if (await page.$(domService.purchaseSuccessDOM)) {
                this.logSessionStage('PURCHASE SUCCESS');
                // Course has been purchased successfully.
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.PURCHASE,
                    details: 'Course has been purchased successfully.', originalPrices: originalPrices
                });
            }
            else {
                // Something went wrong with the purchase.
                this.logSessionStage('PURCHASE FAIL');
                return await this.setCourseStatus({
                    page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.FAIL,
                    details: 'The purchase has failed. Successfully purchase label does not exists.', originalPrices: originalPrices
                });
            }
        }
        catch (error) {
            const errorDetails = systemUtils.getErrorDetails(error);
            this.logSessionStage(`PURCHASE ERROR: ${errorDetails}`);
            return await this.setCourseStatus({
                page: page, courseDataModel: courseDataModel, status: CourseStatusEnum.PURCHASE_ERROR,
                details: `Unexpected error occurred during the purchase process. More details: ${errorDetails}`, originalPrices: null
            });
        }
    }

    async setCourseStatus(data) {
        const { page, status, details, originalPrices } = data;
        let { courseDataModel } = data;
        if (originalPrices) {
            courseDataModel = courseService.updateCoursePrices({
                courseDataModel: courseDataModel,
                originalPrices: originalPrices,
                status: status
            });
        }
        courseDataModel = await courseService.updateCourseStatus({
            courseDataModel: courseDataModel,
            status: status,
            details: details
        });
        if (applicationService.applicationDataModel.mode === ModeEnum.SESSION) {
            logUtils.log(courseDataModel);
        }
        const isErrorInARow = this.validateErrorInARow(status === CourseStatusEnum.PURCHASE_ERROR);
        return {
            page: page,
            courseDataModel: courseDataModel,
            isErrorInARow: isErrorInARow
        };
    }

    checkPurchasedCount(status) {
        if (status !== CourseStatusEnum.PURCHASE) {
            return false;
        }
        courseService.coursesDataModel.totalPurchasedCount++;
        return courseService.coursesDataModel.totalPurchasedCount >= countLimitService.countLimitDataModel.maximumCoursesPurchaseCount;
    }

    async udemyLogout(data) {
        const crawlResultModel = new CrawlResultModel();
        // Logout from Udemy.
        applicationService.applicationDataModel.status = StatusEnum.LOGOUT;
        const { browser, page } = data;
        try {
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepAction();
            const urls = await page.$$eval(domService.href, a => a.map(url => url.href));
            const urlIndex = urls.findIndex(url => url.indexOf(applicationService.applicationDataModel.udemyLogoutURL) > -1);
            if (urlIndex === -1) {
                await this.close(browser, true);
                crawlResultModel.exitReason = StatusEnum.LOGOUT_FAILED;
                return crawlResultModel;
            }
            await page.goto(urls[urlIndex], this.pageOptions);
            await page.waitForFunction(this.waitForFunction, { timeout: this.timeout });
            await this.sleepAction();
            await this.close(browser, true);
        }
        catch (error) {
            logUtils.log(error);
        }
        return data;
    }

    logSessionStage(stageName) {
        if (applicationService.applicationDataModel.mode === ModeEnum.SESSION) {
            logUtils.log(stageName);
        }
    }

    logSessionURL(url) {
        if (applicationService.applicationDataModel.mode === ModeEnum.SESSION) {
            logUtils.log(url);
        }
    }

    validateErrorInARow(isError) {
        if (isError) {
            this.purchaseErrorInARowCount++;
            return this.purchaseErrorInARowCount >= countLimitService.countLimitDataModel.maximumPurchaseErrorInARowCount;
        }
        else {
            this.purchaseErrorInARowCount = 0;
        }
        return false;
    }

    async sleepAction() {
        await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutUdemyActions);
    }

    async sleepLoad() {
        await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutUdemyPageLoad);
    }

    async close(browser, isPlannedClose) {
        this.isPlannedClose = isPlannedClose;
        if (browser) {
            try {
                await browser.close();
            }
            catch (error) { }
        }
    }
}

module.exports = new PuppeteerService();