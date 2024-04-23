import { LogDataModel } from '../../core/models/index.js';
import {
  CourseStatusLogEnum,
  CourseStatusEnum,
  ColorEnum,
  MethodEnum,
  ModeEnum,
  PlaceholderEnum,
  StatusIconEnum,
} from '../../core/enums/index.js';
import accountService from './account.service.js';
import applicationService from './application.service.js';
import countLimitService from './countLimit.service.js';
import courseService from './course.service.js';
import domService from './dom.service.js';
import pathService from './path.service.js';
import puppeteerService from './puppeteer.service.js';
import {
  fileUtils,
  logUtils,
  pathUtils,
  textUtils,
  timeUtils,
  validationUtils,
} from '../../utils/index.js';

class LogService {
  constructor() {
    this.isLogProgress = null;
    this.logDataModel = null;
    this.logInterval = null;
    // ===PATH=== //
    this.baseSessionPath = null;
    this.sessionDirectoryPath = null;
    this.createCoursesValidPath = null;
    this.createCoursesInvalidPath = null;
    this.updateCoursesValidPath = null;
    this.updateCoursesInvalidPath = null;
    this.purchaseCoursesValidPath = null;
    this.purchaseCoursesInvalidPath = null;
    this.i = 0;
    this.frames = ['-', '\\', '|', '/'];
    this.emptyValue = '##';
    this.logSeparator = '==========';
    this.isLogs = true;
  }

  initiate(settings) {
    this.logDataModel = new LogDataModel(settings);
    // Check if any logs active.
    this.isLogs =
      applicationService.applicationDataModel.mode === ModeEnum.STANDARD &&
      (this.logDataModel.isLogCreateCoursesMethodValid ||
        this.logDataModel.isLogCreateCoursesMethodInvalid ||
        this.logDataModel.isLogUpdateCoursesMethodValid ||
        this.logDataModel.isLogUpdateCoursesMethodInvalid ||
        this.logDataModel.isLogPurchaseCoursesMethodValid ||
        this.logDataModel.isLogPurchaseCoursesMethodInvalid);
    this.initiateDirectories();
    this.isLogProgress =
      applicationService.applicationDataModel.mode === ModeEnum.STANDARD;
  }

  initiateDirectories() {
    if (!this.isLogs) {
      return;
    }
    // ===PATH=== //
    this.baseSessionPath = pathService.pathDataModel.distPath;
    this.createSessionDirectory();
    if (this.logDataModel.isLogCreateCoursesMethodValid) {
      this.createCoursesValidPath = this.createFilePath(
        `create_courses_method_valid_${PlaceholderEnum.DATE}`
      );
    }
    if (this.logDataModel.isLogCreateCoursesMethodInvalid) {
      this.createCoursesInvalidPath = this.createFilePath(
        `create_courses_method_invalid_${PlaceholderEnum.DATE}`
      );
    }
    if (this.logDataModel.isLogUpdateCoursesMethodValid) {
      this.updateCoursesValidPath = this.createFilePath(
        `update_courses_method_valid_${PlaceholderEnum.DATE}`
      );
    }
    if (this.logDataModel.isLogUpdateCoursesMethodInvalid) {
      this.updateCoursesInvalidPath = this.createFilePath(
        `update_courses_method_invalid_${PlaceholderEnum.DATE}`
      );
    }
    if (this.logDataModel.isLogPurchaseCoursesMethodValid) {
      this.purchaseCoursesValidPath = this.createFilePath(
        `purchase_courses_method_valid_${PlaceholderEnum.DATE}`
      );
    }
    if (this.logDataModel.isLogPurchaseCoursesMethodInvalid) {
      this.purchaseCoursesInvalidPath = this.createFilePath(
        `purchase_courses_method_invalid_${PlaceholderEnum.DATE}`
      );
    }
  }

  getNextDirectoryIndex() {
    const directories = fileUtils.getAllDirectories(this.baseSessionPath);
    if (!validationUtils.isExists(directories)) {
      return 1;
    }
    return (
      Math.max(...directories.map((name) => textUtils.getSplitNumber(name))) + 1
    );
  }

  createSessionDirectory() {
    this.sessionDirectoryPath = pathUtils.getJoinPath({
      targetPath: this.baseSessionPath,
      targetName: `${this.getNextDirectoryIndex()}_${
        applicationService.applicationDataModel.logDateTime
      }-${textUtils.getEmailLocalPart(accountService.accountDataModel.email)}`,
    });
    fileUtils.createDirectory(this.sessionDirectoryPath);
  }

  createFilePath(fileName) {
    return pathUtils.getJoinPath({
      targetPath: this.sessionDirectoryPath
        ? this.sessionDirectoryPath
        : pathService.pathDataModel.distPath,
      targetName: `${fileName.replace(
        PlaceholderEnum.DATE,
        applicationService.applicationDataModel.logDateTime
      )}.txt`,
    });
  }

  async logCourse(courseDataModel) {
    if (!this.isLogs) {
      return;
    }
    let path = null;
    let isValid = null;
    switch (applicationService.applicationDataModel.method) {
      case MethodEnum.CREATE_COURSES: {
        isValid = courseDataModel.status === CourseStatusEnum.CREATE;
        path = isValid
          ? this.logDataModel.isLogCreateCoursesMethodValid
            ? this.createCoursesValidPath
            : null
          : this.logDataModel.isLogCreateCoursesMethodInvalid
          ? this.createCoursesInvalidPath
          : null;
        break;
      }
      case MethodEnum.UPDATE_COURSES: {
        isValid = courseDataModel.status === CourseStatusEnum.CREATE;
        path = isValid
          ? this.logDataModel.isLogUpdateCoursesMethodValid
            ? this.updateCoursesValidPath
            : null
          : this.logDataModel.isLogUpdateCoursesMethodInvalid
          ? this.updateCoursesInvalidPath
          : null;
        break;
      }
      case MethodEnum.PURCHASE_COURSES: {
        isValid = courseDataModel.status === CourseStatusEnum.PURCHASE;
        path = isValid
          ? this.logDataModel.isLogPurchaseCoursesMethodValid
            ? this.purchaseCoursesValidPath
            : null
          : this.logDataModel.isLogPurchaseCoursesMethodInvalid
          ? this.purchaseCoursesInvalidPath
          : null;
        break;
      }
    }
    if (!path) {
      return;
    }
    // Log the course.
    const message = this.createCourseTemplate({
      courseDataModel: courseDataModel,
      isLog: true,
    });
    await fileUtils.appendFile({
      targetPath: path,
      message: message,
    });
  }

  getCourseName(data) {
    const { courseURLCourseName, udemyURLCourseName, isLog } = data;
    let name = this.emptyValue;
    if (courseURLCourseName) {
      name = courseURLCourseName;
    }
    if (name === this.emptyValue && udemyURLCourseName) {
      name = udemyURLCourseName;
    }
    return isLog
      ? name
      : textUtils.cutText({
          text: name,
          count:
            countLimitService.countLimitDataModel
              .maximumCourseNameCharactersDisplayCount,
        });
  }

  createCourseTemplate(data) {
    const { courseDataModel, isLog } = data;
    const {
      id,
      postId,
      creationDateTime,
      pageNumber,
      indexPageNumber,
      priceNumber,
      priceDisplay,
      courseURLCourseName,
      udemyURLCourseName,
      type,
      isFree,
      languageName,
      courseURL,
      udemyURL,
      couponKey,
      status,
      resultDateTime,
      resultDetails,
    } = courseDataModel;
    const time = timeUtils.getFullTime(resultDateTime);
    const displayCreationDateTime =
      timeUtils.getFullDateTemplate(creationDateTime);
    const displayPriceNumber = priceNumber ? priceNumber : this.emptyValue;
    const displayPriceDisplay = priceDisplay ? priceDisplay : this.emptyValue;
    const displayStatus = CourseStatusLogEnum[status];
    const name = this.getCourseName({
      courseURLCourseName: courseURLCourseName,
      udemyURLCourseName: udemyURLCourseName,
      isLog: isLog,
    });
    const displayCourseURL = textUtils.cutText({
      text: courseURL,
      count:
        countLimitService.countLimitDataModel.maximumURLCharactersDisplayCount,
    });
    const displayUdemyURL = udemyURL
      ? textUtils.cutText({
          text: udemyURL,
          count:
            countLimitService.countLimitDataModel
              .maximumURLCharactersDisplayCount,
        })
      : this.emptyValue;
    const displayResultDetails = resultDetails.join('\n');
    const lines = [];
    lines.push(
      `Time: ${time} | Id: ${id} | Post Id: ${
        postId ? postId : this.emptyValue
      } | Creation Date Time: ${displayCreationDateTime}`
    );
    lines.push(
      `Price Number: ${displayPriceNumber} | Price Display: ${displayPriceDisplay} | Coupon Key: ${couponKey} | Language: ${languageName}`
    );
    lines.push(
      `Status: ${displayStatus} | Page Number: ${pageNumber} | Index Page Number: ${indexPageNumber} | Type: ${type} | Is Free: ${isFree}`
    );
    lines.push(`Name: ${name}`);
    lines.push(`Course URL: ${displayCourseURL}`);
    lines.push(`Udemy URL: ${displayUdemyURL}`);
    lines.push(`Result Details: ${displayResultDetails}`);
    lines.push(`${this.logSeparator}${isLog ? '\n' : ''}`);
    return lines.join('\n');
  }

  startLogProgress() {
    // Start the process for the first interval round.
    this.logInterval = setInterval(() => {
      // Update the current time of the process.
      applicationService.applicationDataModel.time =
        timeUtils.getDifferenceTimeBetweenDates({
          startDateTime: applicationService.applicationDataModel.startDateTime,
          endDateTime: timeUtils.getCurrentDate(),
        });
      // Log the status console each interval round.
      this.logProgress();
    }, countLimitService.countLimitDataModel.millisecondsIntervalCount);
  }

  getCurrentIndex(isPurchase) {
    const totalCount = isPurchase
      ? courseService.coursesDataModel.coursesList.length
      : courseService.coursesDataModel.totalCreateCoursesCount;
    const coursePosition = textUtils.getNumberOfNumber({
      number1: courseService.coursesDataModel.courseIndex,
      number2: totalCount,
    });
    const coursePercentage = textUtils.calculatePercentageDisplay({
      partialValue: courseService.coursesDataModel.courseIndex,
      totalValue: totalCount,
    });
    return `${coursePosition} (${coursePercentage})`;
  }

  getValueOrEmpty(fieldName) {
    return courseService.coursesDataModel.courseDataModel[fieldName]
      ? courseService.coursesDataModel.courseDataModel[fieldName]
      : this.emptyValue;
  }

  logProgress() {
    const specificPageNumber = applicationService.applicationDataModel
      .specificCoursesPageNumber
      ? applicationService.applicationDataModel.specificCoursesPageNumber
      : this.emptyValue;
    const isKeywordsFilter = validationUtils.isExists(
      applicationService.applicationDataModel.keywordsFilterList
    );
    const time = `${applicationService.applicationDataModel.time} [${
      this.frames[(this.i = ++this.i % this.frames.length)]
    }]`;
    const totalCoursesPrice = `₪${textUtils.getNumber2CharactersAfterDot(
      courseService.coursesDataModel.totalCoursesPriceNumber
    )}`;
    const totalPurchasedPrice = `₪${textUtils.getNumber2CharactersAfterDot(
      courseService.coursesDataModel.totalPurchasePriceNumber
    )}`;
    let courseIndex = this.emptyValue;
    const totalSingleCount = textUtils.getNumberWithCommas(
      courseService.coursesDataModel.totalSingleCount
    );
    const totalCourseListCount = textUtils.getNumberWithCommas(
      courseService.coursesDataModel.totalCourseListCount
    );
    const coursesCount = `${textUtils.getNumberWithCommas(
      courseService.coursesDataModel.coursesList.length
    )} (Single: ${totalSingleCount} / Course List: ${totalCourseListCount})`;
    switch (applicationService.applicationDataModel.method) {
      case MethodEnum.CREATE_COURSES: {
        courseIndex = courseService.coursesDataModel.coursesList.length;
        break;
      }
      case MethodEnum.UPDATE_COURSES: {
        courseIndex = this.getCurrentIndex(false);
        break;
      }
      case MethodEnum.PURCHASE_COURSES: {
        courseIndex = this.getCurrentIndex(true);
        break;
      }
    }
    const purchaseCount = `${StatusIconEnum.V}  ${textUtils.getNumberWithCommas(
      courseService.coursesDataModel.purchaseCount
    )}`;
    const failCount = `${StatusIconEnum.X}  ${textUtils.getNumberWithCommas(
      courseService.coursesDataModel.failCount
    )}`;
    let creationDateTime = this.emptyValue;
    let id = this.emptyValue;
    let postId = this.emptyValue;
    let status = this.emptyValue;
    let pageNumber = this.emptyValue;
    let indexPageNumber = this.emptyValue;
    let isFree = this.emptyValue;
    let languageName = this.emptyValue;
    let priceDisplay = this.emptyValue;
    let couponKey = this.emptyValue;
    let type = this.emptyValue;
    let name = this.emptyValue;
    let courseURL = this.emptyValue;
    let udemyURL = this.emptyValue;
    let resultDateTime = this.emptyValue;
    let resultDetails = this.emptyValue;
    if (courseService.coursesDataModel.courseDataModel) {
      creationDateTime = timeUtils.getFullDateTemplate(
        courseService.coursesDataModel.courseDataModel.creationDateTime
      );
      id = courseService.coursesDataModel.courseDataModel.id;
      postId = this.getValueOrEmpty('postId');
      status =
        CourseStatusLogEnum[
          courseService.coursesDataModel.courseDataModel.status
        ];
      pageNumber = courseService.coursesDataModel.courseDataModel.pageNumber;
      indexPageNumber =
        courseService.coursesDataModel.courseDataModel.indexPageNumber;
      isFree =
        courseService.coursesDataModel.courseDataModel.isFree !== null
          ? courseService.coursesDataModel.courseDataModel.isFree
          : this.emptyValue;
      languageName = this.getValueOrEmpty('languageName');
      priceDisplay = this.getValueOrEmpty('priceDisplay');
      couponKey = this.getValueOrEmpty('couponKey');
      type = courseService.coursesDataModel.courseDataModel.type;
      name = this.getCourseName({
        courseURLCourseName:
          courseService.coursesDataModel.courseDataModel.courseURLCourseName,
        udemyURLCourseName:
          courseService.coursesDataModel.courseDataModel.udemyURLCourseName,
        isLog: false,
      });
      courseURL = textUtils.cutText({
        text: courseService.coursesDataModel.courseDataModel.courseURL,
        count:
          countLimitService.countLimitDataModel
            .maximumURLCharactersDisplayCount,
      });
      udemyURL = courseService.coursesDataModel.courseDataModel.udemyURL
        ? textUtils.cutText({
            text: courseService.coursesDataModel.courseDataModel.udemyURL,
            count:
              countLimitService.countLimitDataModel
                .maximumURLCharactersDisplayCount,
          })
        : this.emptyValue;
      resultDateTime = courseService.coursesDataModel.courseDataModel
        .resultDateTime
        ? timeUtils.getFullDateTemplate(
            courseService.coursesDataModel.courseDataModel.resultDateTime
          )
        : this.emptyValue;
      resultDetails = validationUtils.isExists(
        courseService.coursesDataModel.courseDataModel.resultDetails
      )
        ? textUtils.cutText({
            text: courseService.coursesDataModel.courseDataModel.resultDetails.join(
              ' '
            ),
            count:
              countLimitService.countLimitDataModel
                .maximumResultCharactersDisplayCount,
          })
        : this.emptyValue;
    }
    if (!this.isLogProgress) {
      return;
    }
    logUtils.logProgress({
      titlesList: [
        'SETTINGS',
        'GENERAL1',
        'GENERAL2',
        'ACCOUNT',
        'PROCESS1',
        'PROCESS2',
        'PROCESS3',
        'PROCESS4',
        'DATA1',
        'DATA2',
        'DATA3',
        'ERRORS',
        'NAME',
        'COURSE URL',
        'UDEMY URL',
        'RESULT',
      ],
      colorsTitlesList: [
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
        ColorEnum.BLUE,
      ],
      keysLists: [
        {
          Environment: applicationService.applicationDataModel.environment,
          Method: applicationService.applicationDataModel.method,
          'Pages Count': applicationService.applicationDataModel.pagesCount,
          'Specific Page Number': specificPageNumber,
          'Session Number':
            applicationService.applicationDataModel.sessionNumber,
          'Is Keywords Filter': isKeywordsFilter,
        },
        {
          Time: time,
          Course: courseIndex,
          'Courses Count': coursesCount,
        },
        {
          'Total Courses Price': totalCoursesPrice,
          'Total Purchase Price': totalPurchasedPrice,
          'Pages Count': courseService.coursesDataModel.totalPagesCount,
          Status: applicationService.applicationDataModel.status,
        },
        {
          Email: accountService.accountDataModel.email,
          Password: accountService.accountDataModel.asterixsPassword,
        },
        {
          Purchase: purchaseCount,
          Fail: failCount,
          Filter: courseService.coursesDataModel.filterCount,
          'Missing Field': courseService.coursesDataModel.missingFieldCount,
          'Unexpected Field':
            courseService.coursesDataModel.unexpectedFieldCount,
          Duplicate: courseService.coursesDataModel.duplicateCount,
        },
        {
          'Create Update Error':
            courseService.coursesDataModel.createUpdateErrorCount,
          'Empty URL': courseService.coursesDataModel.emptyURLCount,
          'Invalid URL': courseService.coursesDataModel.invalidURLCount,
          'Not Exists': courseService.coursesDataModel.notExistsCount,
          'Page Not Found': courseService.coursesDataModel.pageNotFoundCount,
          'Limit Access': courseService.coursesDataModel.limitAccessCount,
        },
        {
          'Suggestions List':
            courseService.coursesDataModel.suggestionsListCount,
          Private: courseService.coursesDataModel.privateCount,
          'Already Purchase':
            courseService.coursesDataModel.alreadyPurchaseCount,
          'Course Price Not Free':
            courseService.coursesDataModel.coursePriceNotFreeCount,
        },
        {
          'Enroll Not Exists':
            courseService.coursesDataModel.enrollNotExistsCount,
          'Checkout Price Not Exists':
            courseService.coursesDataModel.checkoutPriceNotExistsCount,
          'Checkout Price Not Free':
            courseService.coursesDataModel.checkoutPriceNotFreeCount,
          'Purchase Error': courseService.coursesDataModel.purchaseErrorCount,
        },
        {
          Creation: creationDateTime,
          Id: id,
          'Post Id': postId,
          Status: status,
        },
        {
          'Page Number': pageNumber,
          'Index Page Number': indexPageNumber,
        },
        {
          'Is Free': isFree,
          'Price Display': priceDisplay,
          'Coupon Key': couponKey,
          Type: type,
          Language: languageName,
        },
        {
          'Create Update Error In A Row':
            domService.createUpdateErrorsInARowCount,
          'Purchase Error In A Row': puppeteerService.purchaseErrorInARowCount,
        },
        {
          '#': name,
        },
        {
          '#': courseURL,
        },
        {
          '#': udemyURL,
        },
        {
          Time: resultDateTime,
          Result: resultDetails,
        },
      ],
      colorsLists: [
        [
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
        ],
        [ColorEnum.YELLOW, ColorEnum.YELLOW, ColorEnum.YELLOW],
        [
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
        ],
        [ColorEnum.YELLOW, ColorEnum.YELLOW],
        [
          ColorEnum.GREEN,
          ColorEnum.RED,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
        ],
        [
          ColorEnum.CYAN,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
          ColorEnum.CYAN,
        ],
        [ColorEnum.CYAN, ColorEnum.CYAN, ColorEnum.CYAN, ColorEnum.CYAN],
        [ColorEnum.CYAN, ColorEnum.CYAN, ColorEnum.CYAN, ColorEnum.CYAN],
        [
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
        ],
        [ColorEnum.YELLOW, ColorEnum.YELLOW],
        [
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
          ColorEnum.YELLOW,
        ],
        [ColorEnum.RED, ColorEnum.RED],
        [],
        [],
        [],
        [ColorEnum.CYAN, ColorEnum.CYAN],
      ],
      nonNumericKeys: { Id: 'Id', 'Post Id': 'Post Id' },
      statusColor: ColorEnum.CYAN,
    });
  }

  close() {
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
  }

  createLineTemplate(title, value) {
    return textUtils.addBreakLine(
      `${logUtils.logColor(`${title}:`, ColorEnum.MAGENTA)} ${value}`
    );
  }

  createConfirmSettingsTemplate(settings) {
    const parameters = [
      'MODE',
      'IS_PRODUCTION_ENVIRONMENT',
      'COURSES_BASE_URL',
      'UDEMY_BASE_URL',
      'SINGLE_COURSE_INIT',
      'PAGES_COUNT',
      'SPECIFIC_COURSES_PAGE_NUMBER',
      'KEYWORDS_FILTER_LIST',
      'IS_CREATE_COURSES_METHOD_ACTIVE',
      'IS_UPDATE_COURSES_METHOD_ACTIVE',
      'IS_PURCHASE_COURSES_METHOD_ACTIVE',
      'IS_LOG_CREATE_COURSES_METHOD_VALID',
      'IS_LOG_CREATE_COURSES_METHOD_INVALID',
      'IS_LOG_UPDATE_COURSES_METHOD_VALID',
      'IS_LOG_UPDATE_COURSES_METHOD_INVALID',
      'IS_LOG_PURCHASE_COURSES_METHOD_VALID',
      'IS_LOG_PURCHASE_COURSES_METHOD_INVALID',
      'IS_LOG_PURCHASE_COURSES_METHOD_ONLY',
      'MAXIMUM_COURSES_PURCHASE_COUNT',
    ];
    let settingsText = this.createLineTemplate(
      'EMAIL',
      accountService.accountDataModel.email
    );
    settingsText += Object.keys(settings)
      .filter((s) => parameters.indexOf(s) > -1)
      .map((k) => this.createLineTemplate(k, settings[k]))
      .join('');
    settingsText = textUtils.removeLastCharacters({
      value: settingsText,
      charactersCount: 1,
    });
    return `${textUtils.setLogStatus('IMPORTANT SETTINGS')}
${settingsText}
========================
OK to run? (y = yes)`;
  }
}

export default new LogService();
