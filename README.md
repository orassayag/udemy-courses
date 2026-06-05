# Udemy Courses

A Node.js + Puppeteer.js automation tool that automatically discovers and enrolls in free Udemy courses using coupon codes from coupon websites.

Built in December 2020. This JavaScript application scrapes free course coupons from coupon websites, validates them on Udemy, and automatically enrolls you in truly free courses, helping you build your learning library effortlessly.

## Features

### Core Capabilities

- 🔍 **Automated Course Discovery**: Scrapes free course coupon links from coupon websites
- 🎓 **Auto-Enrollment**: Automatically enrolls in free Udemy courses with valid coupons
- ✅ **Smart Validation**: Validates course data and ensures courses are truly free before enrollment
- 🔄 **Session Management**: Retry failed courses automatically with session support
- 💾 **Backup Functionality**: Built-in backup system for project files

### Technical Excellence

- 🛡️ **Robust Error Handling**: Comprehensive error tracking with automatic retries
- 📊 **Structured Logging**: Detailed logs with statistics for all operations
- 🔐 **Secure Management**: Keeps credentials in separate JSON files away from source code
- 🚀 **Optimized Puppeteer**: Uses stealth plugins and custom user agents to avoid detection
- 📈 **Real-time Analytics**: Live console status with detailed processing statistics

### Developer Experience

- 🛠️ **Sandbox Testing**: Dedicated environment for testing new features safely
- 📝 **Detailed Documentation**: Clear instructions for setup and configuration
- ⚙️ **Configurable Environment**: Flexible settings for fine-tuning automation behavior
- 📂 **Organized Structure**: Clean project layout for easy maintenance and extension
- 🎯 **Targeted Filtering**: Keyword-based filtering to focus on relevant topics

## Architecture Overview

```mermaid
graph TB
    Start([npm start]) --> Init[Initialize Services]
    Init --> Validate[Validate Settings & URLs]
    Validate --> Confirm{User Confirms?}
    Confirm -->|No| Exit1([Exit: Aborted])
    Confirm -->|Yes| CreatePhase[Create Courses Phase]

    CreatePhase --> ScrapePages[Scrape Coupon Pages]
    ScrapePages --> ExtractLinks[Extract Course Links]
    ExtractLinks --> LogCreate[Log Created Courses]

    LogCreate --> UpdatePhase[Update Courses Phase]
    UpdatePhase --> FetchUdemy[Fetch Course Data from Udemy]
    FetchUdemy --> ValidateCourse{Validate Course Data}
    ValidateCourse -->|Invalid| LogInvalid1[Log Invalid Course]
    ValidateCourse -->|Valid| UpdateCourseData[Update Course Data]
    UpdateCourseData --> LogUpdate[Log Updated Course]

    LogUpdate --> PurchasePhase[Purchase Courses Phase]
    PurchasePhase --> LoginUdemy[Login to Udemy via Puppeteer]
    LoginUdemy --> OpenCourse[Open Course with Coupon]
    OpenCourse --> CheckPrice{Is Free?}
    CheckPrice -->|No| LogInvalid2[Log Not Free]
    CheckPrice -->|Yes| CheckEnrolled{Already Enrolled?}
    CheckEnrolled -->|Yes| LogDuplicate[Log Already Enrolled]
    CheckEnrolled -->|No| Enroll[Click Enroll Button]
    Enroll --> VerifyEnrollment{Enrollment Successful?}
    VerifyEnrollment -->|No| LogFail[Log Failed Enrollment]
    VerifyEnrollment -->|Yes| LogSuccess[Log Successful Enrollment]

    LogFail --> CheckRetry{More Courses?}
    LogSuccess --> CheckRetry
    LogInvalid2 --> CheckRetry
    LogDuplicate --> CheckRetry
    CheckRetry -->|Yes| OpenCourse
    CheckRetry -->|No| CheckSession{More Sessions?}
    CheckSession -->|Yes| CreatePhase
    CheckSession -->|No| GenerateStats[Generate Statistics]

    GenerateStats --> SaveLogs[Save All Logs to Dist]
    SaveLogs --> Exit2([Exit: Completed])

    LogInvalid1 --> UpdatePhase

    style Start fill:#90EE90
    style Exit1 fill:#FFB6C1
    style Exit2 fill:#90EE90
    style CreatePhase fill:#87CEEB
    style UpdatePhase fill:#87CEEB
    style PurchasePhase fill:#87CEEB
    style LogSuccess fill:#90EE90
    style LogFail fill:#FFB6C1
```

### Architecture Principles

This project follows clean code and modular architecture principles:

1. **Service-Oriented Design**: Business logic is encapsulated in dedicated services (Puppeteer, Course, Account, etc.).
2. **Data Modeling**: Uses structured models to ensure data consistency across the application.
3. **Separation of Concerns**: Clear distinction between scripts (entry points), services (logic), and utilities (helpers).
4. **Stateless Utilities**: Helper functions are kept pure and stateless for better testability.
5. **Robust Error Handling**: Centralized error management to ensure automation continuity.

### Design Patterns

- **Service Pattern**: Centralizes business logic and promotes reusability.
- **Model Pattern**: Defines clear structures for application data.
- **Singleton-like Services**: Services are designed to be initialized once and used throughout the application.
- **Script-Service-Util**: A layered approach to organize execution flow, logic, and helpers.

## Getting Started

### Prerequisites

- Node.js (v12.20.0, v14.13.1, or v16+)
- npm (comes with Node.js)
- A Udemy account
- Internet connection

### Installation

1. Clone the repository:

```bash
git clone https://github.com/orassayag/udemy-courses.git
cd udemy-courses
```

2. Install dependencies:

```bash
npm install
```

3. Configure your Udemy account:
   - Create a JSON file with your credentials:

   ```json
   {
     "email": "your-email@example.com",
     "password": "your-password"
   }
   ```

   - Update `ACCOUNT_FILE_PATH` in `src/settings/settings.js`

4. Configure settings in `src/settings/settings.js`:

```javascript
// Basic configuration
PAGES_COUNT: 2,                       // Pages to scrape
MAXIMUM_COURSES_PURCHASE_COUNT: 3000, // Max enrollments
IS_PRODUCTION_ENVIRONMENT: false,     // Use false for testing
KEYWORDS_FILTER_LIST: [],             // Filter by keywords (empty = all)
```

## Usage

### Standard Automation

Run the full process from scraping to enrollment:

```bash
npm start
```

### Session Recovery

Retry failed courses from previous sessions:

```bash
npm run session
```

### Creating Backups

Create a timestamped archive of the project:

```bash
npm run backup
```

### Development Testing

Run sandbox tests for specific features:

```bash
npm run sand
```

## Available Scripts

### Start - Main Automation

Run the full automation process:

```bash
npm start
```

### Backup - Create Project Backup

Create a timestamped backup of the project:

```bash
npm run backup
```

### Session - Retry Failed Courses

Test or retry specific course URLs:

```bash
npm run session
```

### Sandbox - Development Testing

Run sandbox tests for development:

```bash
npm run sand
```

## Configuration

### Key Settings in `src/settings/settings.js`

#### General Settings

| Setting                | Description                                | Default                           |
| ---------------------- | ------------------------------------------ | --------------------------------- |
| `MODE`                 | Application mode (STANDARD/SESSION/SILENT) | `STANDARD`                        |
| `COURSES_BASE_URL`     | Coupon website URL                         | `https://www.idownloadcoupon.com` |
| `UDEMY_BASE_URL`       | Udemy base URL                             | `https://www.udemy.com`           |
| `PAGES_COUNT`          | Number of pages to scrape                  | `2`                               |
| `KEYWORDS_FILTER_LIST` | Filter courses by keywords                 | `[]`                              |

#### Feature Flags

| Setting                             | Description            | Default |
| ----------------------------------- | ---------------------- | ------- |
| `IS_CREATE_COURSES_METHOD_ACTIVE`   | Enable course scraping | `true`  |
| `IS_UPDATE_COURSES_METHOD_ACTIVE`   | Enable course updates  | `true`  |
| `IS_PURCHASE_COURSES_METHOD_ACTIVE` | Enable auto-enrollment | `true`  |

#### Limits & Timeouts

| Setting                                         | Description               | Default  |
| ----------------------------------------------- | ------------------------- | -------- |
| `MAXIMUM_COURSES_PURCHASE_COUNT`                | Maximum enrollments       | `3000`   |
| `MAXIMUM_SESSIONS_COUNT`                        | Retry sessions            | `5`      |
| `MILLISECONDS_TIMEOUT_BETWEEN_COURSES_PURCHASE` | Delay between enrollments | `5000ms` |

## Directory Structure

```
udemy-courses/
├── src/
│   ├── core/
│   │   ├── enums/          # Application enums and constants
│   │   └── models/         # Data models for consistency
│   ├── scripts/            # Entry point scripts (start, backup, initiate)
│   ├── services/           # Core business logic services
│   ├── settings/           # Configuration management
│   ├── tests/              # Sandbox and session tests
│   └── utils/              # General helper functions
├── dist/                   # Generated logs and session data
└── package.json            # Project dependencies and scripts
```

## Support

For questions, issues, or contributions:

- **GitHub Issues**: [https://github.com/orassayag/udemy-courses/issues](https://github.com/orassayag/udemy-courses/issues)
- **Author**: [Or Assayag](https://github.com/orassayag)
- **Email**: orassayag@gmail.com

## How It Works

### 1. Create Courses Phase

- Scrapes configured number of pages from coupon website
- Extracts course URLs and coupon codes
- Validates and stores course information
- Logs all discovered courses

### 2. Update Courses Phase

- Validates each course URL on Udemy
- Fetches detailed course information
- Checks if course is accessible and free with coupon
- Updates course data and filters invalid courses

### 3. Purchase Courses Phase

- Logs into Udemy using Puppeteer (headless browser)
- Navigates to each course with its coupon code
- Verifies the course is truly free (₪0 / $0)
- Clicks "Enroll" button if not already enrolled
- Logs success/failure for each enrollment

## Output Files

All logs are saved in the `dist/` directory with the following structure:

```
dist/
└── [SESSION_ID]_[DATE]_[TIME]/
    ├── create_courses_method_valid.txt      # Successfully scraped courses
    ├── create_courses_method_invalid.txt    # Failed scraping attempts
    ├── update_courses_method_valid.txt      # Valid course data from Udemy
    ├── update_courses_method_invalid.txt    # Invalid/inaccessible courses
    ├── purchase_courses_method_valid.txt    # Successfully enrolled courses
    └── purchase_courses_method_invalid.txt  # Failed enrollment attempts
```

## Console Output Example

```
===IMPORTANT SETTINGS===
EMAIL: your****@example.com
MODE: STANDARD
PAGES_COUNT: 2
MAXIMUM_COURSES_PURCHASE_COUNT: 3000
========================

===INITIATE THE SERVICES===
===VALIDATE GENERAL SETTINGS===

===[SETTINGS] Environment: PRODUCTION | Method: PURCHASE COURSES | Pages Count: 2===
===[GENERAL1] Time: 00.00:15:32 | Course: 45/45 (100.00%) | Courses Count: 45===
===[GENERAL2] Total Courses Price: ₪1,250.80 | Total Purchase Price: ₪0.00===
===[ACCOUNT] Email: your****@example.com===
===[PROCESS1] Purchase: ✅ 42 | Fail: ❌ 1 | Filter: 2 | Duplicate: 0===
===[PROCESS2] Create Update Error: 0 | Not Exists: 0 | Page Not Found: 0===
===[PROCESS3] Already Purchase: 0 | Course Price Not Free: 0===
===[NAME] Complete JavaScript Masterclass 2024===
===[UDEMY URL] https://www.udemy.com/course/javascript-complete/?couponCode=ABC123===
===[RESULT] Course has been purchased successfully.===

===EXIT: FINISH===
```

## Troubleshooting

### Common Issues

| Issue                 | Solution                                                        |
| --------------------- | --------------------------------------------------------------- |
| No courses found      | Check `COURSES_BASE_URL` is accessible and `PAGES_COUNT` is set |
| Login failed          | Verify credentials in account JSON file                         |
| Courses not enrolling | Ensure courses are truly free; check console for errors         |
| Rate limiting         | Increase timeouts, reduce `PAGES_COUNT`                         |
| Selector errors       | Udemy may have updated UI; check for updates or open an issue   |

## Best Practices

1. ✅ Start with `PAGES_COUNT: 1` for testing
2. ✅ Use `IS_PRODUCTION_ENVIRONMENT: false` initially
3. ✅ Set reasonable `MAXIMUM_COURSES_PURCHASE_COUNT`
4. ✅ Keep credentials in separate JSON file (never commit)
5. ✅ Monitor `dist/` logs for detailed information
6. ✅ Run `npm run backup` before major changes
7. ✅ Respect Udemy's Terms of Service

## Legal & Ethical Use

⚠️ **Important Notice:**

- Only use for courses that are legitimately free with valid coupons
- Respect Udemy's Terms of Service
- Don't abuse the system or use for commercial purposes
- Use responsibly to build your personal learning library

## Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Development

Built with:

- **Node.js** - JavaScript runtime
- **Puppeteer** - Headless browser automation
- **JSDOM** - HTML parsing
- **fs-extra** - Enhanced file system operations

## Author

- **Or Assayag** - _Initial work_ - [orassayag](https://github.com/orassayag)
- Or Assayag <orassayag@gmail.com>
- GitHub: https://github.com/orassayag
- StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
- LinkedIn: https://linkedin.com/in/orassayag

## License

This application has an MIT license - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for educational and research purposes
- Respects robots.txt and implements rate limiting
- Uses user-agent rotation to avoid detection
- Implements polite crawling practices
