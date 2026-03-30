# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/udemy-courses/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Error messages or logs
   - Your environment details (OS, Node version)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:
- **JavaScript (ES6+)** with ES modules
- **ESLint** for code quality
- **jsbeautify** for code formatting

Before submitting:
```bash
# Install dependencies
npm install

# Run the application to test
npm start

# Test the backup functionality
npm run backup

# Test session mode
npm run session
```

### Coding Standards

1. **ES Modules**: Use `import/export` syntax
2. **Error handling**: Implement proper error handling with try-catch blocks
3. **Clear naming**: Use descriptive names for variables and functions
4. **Service pattern**: Follow the existing service-based architecture
5. **Settings management**: Add new configurations to `src/settings/settings.js`
6. **Logging**: Use the log service for consistent logging

### Adding New Features

When adding new features:
1. Add configuration options to `src/settings/settings.js`
2. Create or update services in `src/services/files/`
3. Update models in `src/core/models/` if needed
4. Add enums to `src/core/enums/files/` for new status types
5. Update scripts in `src/scripts/` if needed
6. Test thoroughly with both development and production settings

### Important Notes

- **Account Security**: Never commit actual Udemy account credentials
- **Selector Changes**: Udemy frequently updates their UI; selectors in DOM service may need updates
- **Rate Limiting**: Be mindful of timeouts and delays to avoid being blocked
- **Legal Compliance**: Ensure all changes comply with Udemy's Terms of Service

### Testing Checklist

Before submitting a PR:
- [ ] Code follows existing patterns and style
- [ ] All settings in `settings.js` work correctly
- [ ] Tested in both development and production environments
- [ ] No hardcoded credentials or sensitive data
- [ ] Log files are generated correctly in `dist/` folder
- [ ] Backup functionality still works
- [ ] Error handling is implemented
- [ ] No breaking changes to existing functionality

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
