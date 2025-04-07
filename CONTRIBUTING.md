# Contributing to SmartMate AI

Thank you for considering contributing to SmartMate AI! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the [Issues](https://github.com/chirag127/SmartMate-AI/issues)
- If not, create a new issue with a descriptive title and clear description
- Include steps to reproduce the bug, expected behavior, and actual behavior
- Add screenshots if applicable

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the [Issues](https://github.com/chirag127/SmartMate-AI/issues)
- If not, create a new issue with a descriptive title and clear description
- Explain why this enhancement would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/chirag127/SmartMate-AI.git
   cd SmartMate-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Then edit the `.env` file with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For the extension, load it in your browser as described in the README.

## Coding Guidelines

- Follow the ESLint configuration provided in the project
- Write clear, descriptive commit messages
- Add comments for complex code sections
- Write tests for new features or bug fixes

## Testing

Run tests with:

```bash
npm test
```

## Building

Build the extension with:

```bash
npm run build
```

This will generate the necessary icon files and prepare the extension for distribution.

## License

By contributing to SmartMate AI, you agree that your contributions will be licensed under the project's MIT License.
