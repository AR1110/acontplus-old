# AcontPlus Angular Client

AcontPlus is a modern, modular business management platform built with Angular 20+. It provides a comprehensive suite of features for accounting, inventory, sales, technical support, restaurant, barber shop, veterinary, and more. The client application is designed for scalability, maintainability, and a seamless user experience, leveraging the latest Angular features and best practices.

## Features
- Modular architecture (accounting, inventory, sales, etc.)
- Standalone Angular components
- Modern Angular 20+ build system
- Fast, reliable testing with Jest (ESM support)
- Path aliasing for clean imports
- Responsive UI and theming

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Install dependencies
```sh
npm install
```

### 2. Run the development server
```sh
npm start
```
- The app will be available at `http://localhost:4200` by default.

### 3. Build for production
```sh
npm run production
```
- Output will be in the `dist/` directory.

---

## Running Tests (Jest + Angular 20+)

This project uses **Jest** for fast, modern unit testing with full ESM and Angular 20+ support.

### 1. Run all tests
```sh
npm test
```

### 2. Run tests in watch mode
```sh
npm run test:watch
```

### 3. View coverage report
After running tests, open `coverage/index.html` in your browser for a detailed coverage report.

#### Notes:
- All path aliases from `tsconfig.json` are supported in tests.
- Standalone components must be added to the `imports` array in tests.
- Mock providers for any required dependencies in your test setup (see `app.component.spec.ts` for an example).

---

## Troubleshooting
- If you see errors about missing providers, add mocks for those dependencies in your test's `providers` array.
- For ESM/Angular/Jest issues, ensure you are using the latest versions of Angular, Jest, and `jest-preset-angular`.

---

## License
This project is proprietary. All rights reserved.
