# Contributing to Sentence Highlighter

Thank you for your interest in contributing to Sentence Highlighter! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [Issues](https://github.com/akhildesai20/sentence-highlighter/issues) section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Code example if possible

### Suggesting Features

1. Check if the feature has already been suggested
2. Open an issue with:
   - Clear description of the feature
   - Use case and benefits
   - Example of how it would work

### Submitting Code

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**:
   - Test in multiple browsers
   - Test with the example file
   - Ensure no breaking changes
5. **Commit your changes**:
   ```bash
   git commit -m "Add: description of your changes"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**:
   - Clear title and description
   - Reference any related issues
   - Explain what changed and why

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/akhildesai20/sentence-highlighter.git
   cd sentence-highlighter
   ```

2. Open `example-usage.html` in a browser to test

3. Make changes to `sentence-highlighter.js`

4. Test your changes in the browser

5. Build minified version (optional):
   ```bash
   npm run build
   ```

## Code Style Guidelines

- Use ES6+ features
- Follow existing naming conventions:
  - Classes: `PascalCase`
  - Methods: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Add JSDoc comments for public methods
- Keep functions focused and single-purpose
- Use meaningful variable names

## Project Structure

```
sentence-highlighter/
├── sentence-highlighter.js      # Main library (source)
├── sentence-highlighter.min.js   # Minified version
├── example-usage.html            # Example/demo file
├── sentence-highlighter-README.md # Full documentation
├── LIBRARY-README.md            # Quick start guide
├── CONTRIBUTING.md              # This file
├── CHANGELOG.md                 # Version history
├── LICENSE                      # MIT License
└── package.json                 # npm package config
```

## Areas for Contribution

- **Performance improvements**: Optimize sentence detection, DOM manipulation
- **Browser compatibility**: Test and fix issues in different browsers
- **Features**: See roadmap in main README
- **Documentation**: Improve examples, add tutorials
- **Tests**: Add unit tests or integration tests
- **TypeScript**: Add TypeScript definitions
- **Framework wrappers**: React, Vue, Angular components

## Questions?

Feel free to:
- Open an issue for questions
- Contact the maintainer: akhil.desai20@gmail.com
- Connect on LinkedIn: [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

Thank you for contributing! 🎉

