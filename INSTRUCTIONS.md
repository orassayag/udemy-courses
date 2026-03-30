# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Udemy account (see Configuration section below)

## Configuration

### Account Setup

1. Create a JSON file with your Udemy account credentials:
   ```json
   {
     "email": "your-email@example.com",
     "password": "your-password"
   }
   ```
2. Update the `ACCOUNT_FILE_PATH` in `src/settings/settings.js` to point to this file
3. **IMPORTANT**: Never commit this file to version control

### Settings Configuration

Open `src/settings/settings.js` and configure the following key settings:

#### General Settings
- `MODE`: Application mode - `STANDARD`, `SESSION`, or `SILENT`
- `COURSES_BASE_URL`: Coupon site URL (default: `https://www.idownloadcoupon.com`)
- `UDEMY_BASE_URL`: Udemy base URL (default: `https://www.udemy.com`)
- `PAGES_COUNT`: Number of pages to scrape for courses (default: 2)
- `SPECIFIC_COURSES_PAGE_NUMBER`: Target specific page number (default: null for all pages)
- `KEYWORDS_FILTER_LIST`: Array of keywords to filter courses (empty = all courses)

#### Method Flags
- `IS_CREATE_COURSES_METHOD_ACTIVE`: Enable course scraping (default: true)
- `IS_UPDATE_COURSES_METHOD_ACTIVE`: Enable course data updates (default: true)
- `IS_PURCHASE_COURSES_METHOD_ACTIVE`: Enable automatic enrollment (default: true)

#### Environment
- `IS_PRODUCTION_ENVIRONMENT`: Set to `true` for production, `false` for development

#### Limits
- `MAXIMUM_COURSES_PURCHASE_COUNT`: Maximum courses to enroll in (default: 3000)
- `MILLISECONDS_TIMEOUT_SOURCE_REQUEST_COUNT`: Page load timeout (default: 60000ms)
- `MAXIMUM_SESSIONS_COUNT`: Retry sessions for failed courses (default: 5)

#### Logging
- `IS_LOG_CREATE_COURSES_METHOD_VALID`: Log successful course creation
- `IS_LOG_CREATE_COURSES_METHOD_INVALID`: Log failed course creation
- `IS_LOG_UPDATE_COURSES_METHOD_VALID`: Log successful course updates
- `IS_LOG_UPDATE_COURSES_METHOD_INVALID`: Log failed course updates
- `IS_LOG_PURCHASE_COURSES_METHOD_VALID`: Log successful enrollments
- `IS_LOG_PURCHASE_COURSES_METHOD_INVALID`: Log failed enrollments

## Running the Application

### Standard Mode - Full Automation
Run all three methods (create, update, purchase):
```bash
npm start
```

**Process Flow:**
1. Scrapes course links from coupon website
2. Updates course information from Udemy
3. Automatically enrolls in free courses

### Session Mode - Retry Failed Courses
```bash
npm run session
```

**Use Case:**
- Retry courses that failed in previous sessions
- Process specific URLs manually

### Backup Mode
Create a backup of the project:
```bash
npm run backup
```

**What Gets Backed Up:**
- Source code and configuration
- Log files and course data
- Excludes: node_modules, dist, .git

### Test Modes
```bash
# Test Udemy session
npm run session

# Sandbox testing
npm run sand
```

## Quick Start Guide

### Fast Setup (5 Minutes)

1. **Install and Configure:**
   ```bash
   npm install
   ```

2. **Set Up Account:**
   - Create account JSON file with Udemy credentials
   - Update `ACCOUNT_FILE_PATH` in settings

3. **Configure Basic Settings:**
   ```javascript
   // In src/settings/settings.js
   IS_PRODUCTION_ENVIRONMENT: false,  // Use false for testing
   PAGES_COUNT: 1,                    // Start with 1 page
   MAXIMUM_COURSES_PURCHASE_COUNT: 10 // Limit for testing
   ```

4. **Run:**
   ```bash
   npm start
   ```

5. **Confirm:**
   When prompted, review the settings and type `y` to proceed

## Understanding the Output

### Console Status Display

```
===IMPORTANT SETTINGS===
EMAIL: your****@gmail.com
MODE: STANDARD
COURSES_BASE_URL: https://www.idownloadcoupon.com
PAGES_COUNT: 2
MAXIMUM_COURSES_PURCHASE_COUNT: 3000
========================

===INITIATE THE SERVICES===
===VALIDATE GENERAL SETTINGS===

===[SETTINGS] Environment: DEVELOPMENT | Method: PURCHASE COURSES | Pages Count: 2===
===[GENERAL1] Time: 00.00:15:32 | Course: 45/45 (100.00%) | Courses Count: 45===
===[GENERAL2] Total Courses Price: ₪1,250.80 | Total Purchase Price: ₪1,250.80===
===[ACCOUNT] Email: your****@gmail.com===
===[PROCESS1] Purchase: ✅ 42 | Fail: ❌ 1 | Filter: 2 | Duplicate: 0===
===[PROCESS2] Create Update Error: 0 | Not Exists: 0 | Page Not Found: 0===
===[PROCESS3] Already Purchase: 0 | Course Price Not Free: 0===
===[NAME] Complete JavaScript Course===
===[UDEMY URL] https://www.udemy.com/course/javascript-complete/?couponCode=ABC123===
===[RESULT] Course has been purchased successfully.===

===EXIT: FINISH===
```

### Status Breakdown

- **SETTINGS**: Current configuration and environment
- **GENERAL1**: Progress, timing, and course count
- **GENERAL2**: Pricing information and overall status
- **ACCOUNT**: Logged-in Udemy account
- **PROCESS1-4**: Success/failure statistics for each operation
- **NAME/URL/RESULT**: Current course being processed

## Output Files

All logs and data are saved in the `dist/` directory:

```
dist/
└── [SESSION_ID]_[DATE]_[TIME]/
    ├── create_courses_method_valid.txt
    ├── create_courses_method_invalid.txt
    ├── update_courses_method_valid.txt
    ├── update_courses_method_invalid.txt
    ├── purchase_courses_method_valid.txt
    └── purchase_courses_method_invalid.txt
```

## Troubleshooting

### Common Issues

#### No Courses Found
- Check `COURSES_BASE_URL` is accessible
- Verify `PAGES_COUNT` is set correctly
- Check internet connection

#### Login Failed
- Verify account credentials in JSON file
- Check `ACCOUNT_FILE_PATH` points to correct file
- Ensure Udemy account is active

#### Courses Not Enrolling
- Check if courses are truly free with the coupon
- Verify `IS_PURCHASE_COURSES_METHOD_ACTIVE` is true
- Look for errors in console output
- Check if you've already enrolled in the course

#### Rate Limiting / Blocked
- Increase timeout values in settings
- Reduce `PAGES_COUNT`
- Add delays between operations

#### Selector Not Found
- Udemy may have updated their UI
- Check `src/services/files/dom.service.js` for selector updates
- Open an issue on GitHub

## Best Practices

1. **Start Small**: Begin with `PAGES_COUNT: 1` and a low purchase limit
2. **Use Development Mode**: Test with `IS_PRODUCTION_ENVIRONMENT: false`
3. **Monitor Logs**: Check output files in `dist/` for detailed information
4. **Backup Regularly**: Use `npm run backup` before major changes
5. **Respect Rate Limits**: Don't set timeouts too low
6. **Legal Compliance**: Only use for free courses with valid coupons

## Advanced Features

### Keyword Filtering
Filter courses by specific keywords:
```javascript
KEYWORDS_FILTER_LIST: ['javascript', 'python', 'web development']
```

### Specific Page Scraping
Target a specific page number:
```javascript
SPECIFIC_COURSES_PAGE_NUMBER: 5  // Only scrape page 5
```

### Session Management
The application supports multiple sessions to retry failed courses automatically:
```javascript
MAXIMUM_SESSIONS_COUNT: 5  // Will retry failed courses up to 5 times
```

## Notes

- The application requires an internet connection
- Udemy selectors may change; keep the application updated
- Never share your account credentials file
- Use responsibly and in accordance with Udemy's Terms of Service

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
