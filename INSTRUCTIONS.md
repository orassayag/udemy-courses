## Instructions

===================
FAST & BASIC START.
===================
1. Open the project in IDE (Current to 12/19/2020 I'm using VSCode).
2. Open the following file in the src/settings/settings.js file.
3. Search for the first setting - 'IS_CREATE_COURSES_METHOD_ACTIVE' and 'IS_PURCHASE_COURSES_METHOD_ACTIVE' - Make sure they are set to true.
4. Next - Time to install the NPM packages. On the terminal run 'npm run i'.
5. Once finished with the node_modules installation, it's time to set up your date.
6. Open once again the Open the following file in the src/settings/settings.js file.
7. Go to the 'COURSES_DATES_VALUE' setting and change the date to the desired date. If you want the date of the current day, don't change anything.
8. You are ready to start to crawl.
9. On terminal run 'npm start'. If everything goes well, you will start to see the console status line appear.
10. If you see any error - Need to check what's changed. Current to 12/19/2020, It works fine.
11. If you see the console status line but the 'Course' is not progressing - Need to check what's wrong.
12. If no errors and the progress works OK, make sure to check on dist/date of today (Example: 1_20200316_222124)/ That all TXT
	files created successfully.
13. Successful running application on production/development should look like this:
/* cSpell:disable */
===IMPORTANT SETTINGS===
COURSES_DATES_VALUE: 2021/03/09
EMAIL: orassayag@gmail.com
MODE: STANDARD
COURSES_BASE_URL: https://www.idownloadcoupon.com
UDEMY_BASE_URL: https://www.udemy.com
SINGLE_COURSE_INIT: https://click.linksynergy.com/deeplink?
SPECIFIC_COURSES_PAGE_NUMBER: null
KEYWORDS_FILTER_LIST:
IS_PRODUCTION_ENVIRONMENT: true
IS_CREATE_COURSES_METHOD_ACTIVE: true
IS_UPDATE_COURSES_METHOD_ACTIVE: true
IS_PURCHASE_COURSES_METHOD_ACTIVE: true
IS_LOG_CREATE_COURSES_METHOD_VALID: true
IS_LOG_CREATE_COURSES_METHOD_INVALID: true
IS_LOG_UPDATE_COURSES_METHOD_VALID: true
IS_LOG_UPDATE_COURSES_METHOD_INVALID: true
IS_LOG_PURCHASE_COURSES_METHOD_VALID: true
IS_LOG_PURCHASE_COURSES_METHOD_INVALID: true
MAXIMUM_COURSES_PURCHASE_COUNT: 3000
MAXIMUM_PAGES_NUMBER: 20
========================
OK to run? (y = yes)
y
===INITIATE THE SERVICES===
===VALIDATE GENERAL SETTINGS===
===[SETTINGS] Environment: PRODUCTION | Method: CREATE COURSES | Specific Page Number: ##===
===[GENERAL1] Time: 00.00:00:13 [/] | Total Price Purchase: ₪0.00 | Course: 19 | Courses Count: 19 (Single: 19 / Course List: 0)===
===[GENERAL2] Session Number: 0 | Is Keywords Filter: false | Pages Count: 1 | Status: CREATE COURSES===
===[DATES] Type: SINGLE | Value: 2021/03/09 | Dates: 1/1 | Current Date: 2021/03/09===
===[ACCOUNT] Email: ############### | Password: *******************===
===[PROCESS1] Purchase: ✅  0 | Fail: ❌  0 | Filter: 0 | Missing Field: 0 | Unexpected Field: 0 | Duplicate: 0===
===[PROCESS2] Create Update Error: 0 | Empty URL: 0 | Invalid URL: 0 | Not Exists: 0 | Page Not Found: 0 | Limit Access: 0===
===[PROCESS3] Suggestions List: 0 | Private: 0 | Already Purchase: 0 | Course Price Not Free: 0===
===[PROCESS4] Enroll Not Exists: 0 | Checkout Price Not Exists: 0 | Checkout Price Not Free: 0 | Purchase Error: 0===
===[DATA1] Creation: 10/03/2021 21:15:54 | Id: 19 | Post Id: 47105 | Status: CREATE===
===[DATA2] Publish Date: 2021/03/09 | Page Number: 2 | Index Page Number: 1===
===[DATA3] Is Free: ## | Price Display: ## | Coupon Key: ## | Type: SINGLE===
===[ERRORS] Create Update Error In A Row: 0 | Purchase Error In A Row: 0===
===[NAME] Master en webs Full Stack: Angular, Node, Laravel, Symfony +===
===[COURSE URL] https://idownloadcoupon.com/2021/03/09/master-en-webs-full-stack-angular-node-laravel-symfony/===
===[UDEMY URL] ##===
===[RESULT] Time: ## | Result: ##===
Terminate batch job (Y/N)? y

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverFlow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://il.linkedin.com/in/orassayag