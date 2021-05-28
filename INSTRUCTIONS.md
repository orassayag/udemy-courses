## Instructions

===================
FAST & BASIC START.
===================
1. Open the project in IDE (Current to 12/19/2020 I'm using VSCode).
2. Open the following file in the 'src/settings/settings.js' file.
3. Search for the first setting - 'IS_CREATE_COURSES_METHOD_ACTIVE' and 'IS_PURCHASE_COURSES_METHOD_ACTIVE' - Make sure they are set to true.
4. Next - Time to install the NPM packages. In the terminal run: 'npm run i'.
5. Once finished with the node_modules installation, it's time to set up the pages count.
6. Open once again the Open the following file in the 'src/settings/settings.js' file.
7. Go to the 'PAGES_COUNT' setting and change the pages count to the one you desire. Each day the website has 30-40 new pages.
8. You are ready to start to crawl.
9. In the terminal run: 'npm start'. If everything goes well, you will start to see the console status line appear.
10. If you see any error - Need to check what's changed. Current to 12/19/2020, it works fine.
11. If you see the console status line but the 'Course' is not progressing - Need to check what's wrong.
12. If no errors and the progress works OK, make sure to check on dist/date of today (Example: 1_20200316_222124)/ that all TXT
    files created successfully.
13. Successful running application on production/development should look like this:

/* cSpell:disable */
===IMPORTANT SETTINGS===
EMAIL: ***********@gmail.com
MODE: STANDARD
COURSES_BASE_URL: https://www.idownloadcoupon.com
UDEMY_BASE_URL: https://www.udemy.com
SINGLE_COURSE_INIT: https://click.linksynergy.com/deeplink?
PAGES_COUNT: 1
SPECIFIC_COURSES_PAGE_NUMBER: null
KEYWORDS_FILTER_LIST:
IS_PRODUCTION_ENVIRONMENT: false
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
========================
OK to run? (y = yes)
y
===INITIATE THE SERVICES===
===VALIDATE GENERAL SETTINGS===
===[SETTINGS] Environment: DEVELOPMENT | Method: PURCHASE COURSES | Pages Count: 1 | Specific Page Number: ## | Session Number: 5 | Is Keywords Filter: false===
===[GENERAL1] Time: 00.00:04:24 [-] | Course: 9/9 (100.00%) | Courses Count: 9 (Single: 9 / Course List: 0)===
===[GENERAL2] Total Courses Price: ₪959.60 | Total Purchase Price: ₪959.60 | Pages Count: 1 | Status: FINISH===
===[ACCOUNT] Email: ***********@gmail.com | Password: *******************===
===[PROCESS1] Purchase: ✅  8 | Fail: ❌  0 | Filter: 0 | Missing Field: 0 | Unexpected Field: 0 | Duplicate: 0===
===[PROCESS2] Create Update Error: 0 | Empty URL: 0 | Invalid URL: 0 | Not Exists: 0 | Page Not Found: 0 | Limit Access: 0===
===[PROCESS3] Suggestions List: 0 | Private: 0 | Already Purchase: 0 | Course Price Not Free: 0===
===[PROCESS4] Enroll Not Exists: 0 | Checkout Price Not Exists: 0 | Checkout Price Not Free: 0 | Purchase Error: 0===
===[DATA1] Creation: 24/04/2021 14:22:48 | Id: 9 | Post Id: 58958 | Status: PURCHASE===
===[DATA2] Page Number: 1 | Index Page Number: 0===
===[DATA3] Is Free: true | Price Display: ₪399.90 | Coupon Key: F32568BF88956BC291DA | Type: SINGLE===
===[ERRORS] Create Update Error In A Row: 0 | Purchase Error In A Row: 0===
===[NAME] Pinheroes===
===[COURSE URL] https://idownloadcoupon.com/coupon/complete-guide-to-pinterest-pinterest-growth-2021-3/===
===[UDEMY URL] https://www.udemy.com/course/pinheroes/?couponCode=F32568BF88956BC291DA===
===[RESULT] Time: 24/04/2021 14:26:14 | Result: Course has been purchased successfully.===
===EXIT: FINISH===

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverFlow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag