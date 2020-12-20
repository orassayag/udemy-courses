const { pathUtils, timeUtils } = require('../utils');

const settings = {
    // ===GENERAL=== //
    // Determine the URL of the courses to get the courses URLs from.
    COURSES_BASE_URL: 'https://www.idownloadcoupon.com',
    // Determine the URL of Udemy site to purchase the courses by the URLs.
    UDEMY_BASE_URL: 'https://www.udemy.com',
    // Determine if the init of the link to the single course on Udemy.
    SINGLE_COURSE_INIT: 'https://click.linksynergy.com/deeplink?',
    // Determine the date of the courses page. Default is the current date.
    // If not, use yyyy/mm/dd format. Example: 2020/12/13
    COURSES_DATE: timeUtils.getCommasDate(),
    // Determine the specific courses page (in the pagination) to crawl. If null,
    // will scan all the courses pages until reached the maximum number (MAXIMUM_PAGES_NUMBER).
    SPECIFIC_COURSES_PAGE_NUMBER: null,
    // Determine which courses to purchase that contains the specific key words.
    // If empty, will purchase all courses available.
    KEY_WORDS_FILTER_LIST: [],

    // ===FLAG=== //
    // Determine if to perform the get courses method.
    IS_GET_COURSES_METHOD_ACTIVE: true,
    // Determine if to perform the purchase courses method.
    IS_PURCHASE_COURSES_METHOD_ACTIVE: false,

    // ===LOG=== //
    // Determine if to log the get courses valid courses (get courses method).
    IS_LOG_GET_COURSES_VALID: true,
    // Determine if to log the get courses invalid courses (get courses method).
    IS_LOG_GET_COURSES_INVALID: true,
    // Determine if to log the purchase courses valid courses (purchase courses method).
    IS_LOG_PURCHASE_COURSES_VALID: true,
    // Determine if to log the purchase courses invalid courses (purchase courses method).
    IS_LOG_PURCHASE_COURSES_INVALID: true,

    // ===COUNT & LIMIT=== //
    // Determine the maximum courses count to purchase per process.
    MAXIMUM_COURSES_PURCHASE_COUNT: 1000,
    // Determine the milliseconds count timeout to wait for answer to get the page or engine source.
    MILLISECONDS_TIMEOUT_SOURCE_REQUEST_COUNT: 60000,
    // Determine the maximum number of pagination for courses on the main page of the courses URL.
    MAXIMUM_PAGES_NUMBER: 20,
    // Determine how much milliseconds interval to run to calculate the time of the
    // status line in the console.
    MILLISECONDS_INTERVAL_COUNT: 500,
    // Determine the milliseconds count timeout to wait for between courses creation.
    MILLISECONDS_TIMEOUT_BETWEEN_COURSES_CREATE: 200,
    // Determine the milliseconds count timeout to wait for between main pagination.
    MILLISECONDS_TIMEOUT_BETWEEN_COURSES_MAIN_PAGES: 200,
    // Determine the milliseconds count timeout to wait for between update courses data.
    MILLISECONDS_TIMEOUT_BETWEEN_COURSES_UPDATE: 200,
    // Determine the maximum characters count to display the course name on the console status.
    MAXIMUM_COURSE_NAME_CHARACTERS_DISPLAY_COUNT: 150,
    // Determine the maximum characters count to display URL (courses or Udemy) on the console status.
    MAXIMUM_URL_CHARACTERS_DISPLAY_COUNT: 150,
    // Determine the maximum characters count to result details on the console status.
    MAXIMUM_RESULT_CHARACTERS_DISPLAY_COUNT: 150,
    // Determine the maximum Udemy login attempts before exit.
    MAXIMUM_UDEMY_LOGIN_ATTEMPTS_COUNT: 5,
    // Determine the milliseconds count timeout to wait after any Udemy crawling action.
    MILLISECONDS_TIMEOUT_UDEMY_ACTIONS: 1000,
    // Determine the milliseconds count timeout to wait for between Udemy course purchase.
    MILLISECONDS_TIMEOUT_BETWEEN_COURSES_PURCHASE: 5000,
    // Determine the milliseconds count timeout to wait after any Udemy page to load.
    MILLISECONDS_TIMEOUT_UDEMY_PAGE_LOAD: 5000,
    // Determine the number of get process error in a row, which after exceeded this count the program will exit.
    MAXIMUM_GET_ERROR_IN_A_ROW_COUNT: 5,
    // Determine the number of purchase process error in a row, which after exceeded this count the program will exit.
    MAXIMUM_PURCHASE_ERROR_IN_A_ROW_COUNT: 5,

    // ===ROOT PATH=== //
    // Determine the application name used for some of the calculated paths.
    APPLICATION_NAME: 'udemy-courses',
    // Determine the path for the outer application, where other directories located, such as backups, sources, etc..
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\').
    OUTER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../../'
    }),
    // Determine the inner application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses\\').
    INNER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../'
    }),
    // Determine the path of the JSON file from which the Udemy account will be fetched. Must be a JSON file.
    ACCOUNT_FILE_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../../../../../Accounts/Udemy/account.json'
    }),

    // ===DYNAMIC PATH=== //
    // All the these paths will be calculated during runtime in the initiate service.
    // DON'T REMOVE THE KEYS, THEY WILL BE CALCULATED TO PATHS DURING RUNTIME.
    // Determine the application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses').
    APPLICATION_PATH: 'udemy-courses',
    // Determine the backups directory which all the local backup will be created to.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\backups').
    BACKUPS_PATH: 'backups',
    // Determine the dist directory path which there, all the outcome of the crawling will be created.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses\\dist').
    DIST_PATH: 'dist',
    // Determine the directory path of the node_modules, do refresh each time switching from development and production modes.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses\\node_modules').
    NODE_MODULES_PATH: 'node_modules',
    // Determine the directory of the package.json to update each time switching
    // from development and production modes (add/remove Puppeeter.js NPM package).
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses\\package.json').
    PACKAGE_JSON_PATH: 'package.json',
    // Determine the path of the package-lock.json to remove it each time switching from development and production modes.
    // (Working example: 'C:\\Or\\Web\\udemy-courses\\udemy-courses\\package-lock.json').
    PACKAGE_LOCK_JSON_PATH: 'package-lock.json',

    // ===BACKUP=== //
    // Determine the directories to ignore when an backup copy is taking place.
    // For example: 'dist'.
    IGNORE_DIRECTORIES: ['dist', 'node_modules'],
    // Determine the files to ignore when the back copy is taking place.
    // For example: 'back_sources_tasks.txt'.
    IGNORE_FILES: [],
    // Determine the files to force include when the back copy is taking place.
    // For example: '.gitignore'.
    INCLUDE_FILES: ['.gitignore'],
    // Determine the period of time in milliseconds to
    // check that files were created / moved to the target path.
    MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT: 1000,
    // Determine the number of time in loop to check for version of a backup.
    // For example, if a backup name "test-test-test-1" exists, it will check for "test-test-test-2",
    // and so on, until the current maximum number.
    BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT: 50
};

module.exports = settings;