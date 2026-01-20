# Security Policy

## Supported Versions

Specifically, we provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Merlin seriously. If you believe you have found a security vulnerability, please report it to us by opening a private security advisory on GitHub or by contacting the maintainers directly.

### Our Approach
1. **Validation**: All inputs are validated against a strict Zod schema.
2. **Parsing**: The LaTeX-Lite parser is a whitelist-only parser.
3. **Rendering**: React's built-in XSS protections are utilized.

Please do not report security vulnerabilities through public GitHub issues.
