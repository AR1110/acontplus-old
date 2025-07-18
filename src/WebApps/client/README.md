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

---

## Recommended Scaffolding & Project Structure

For large, modern Angular frontends, use the following best practices for maintainability, testability, and scalability:

### 1. Schematics Configuration (angular.json)

```json
"schematics": {
  "@schematics/angular:component": {
    "style": "scss",
    "inlineStyle": false,
    "inlineTemplate": false,
    "changeDetection": "OnPush",
    "skipTests": false,
    "standalone": true,
    "flat": false
  },
  "@schematics/angular:service": {
    "skipTests": false,
    "flat": false
  },
  "@schematics/angular:directive": {
    "skipTests": false,
    "flat": false
  },
  "@schematics/angular:pipe": {
    "skipTests": false,
    "flat": false
  },
  "@schematics/angular:guard": {
    "skipTests": false,
    "flat": false
  },
  "@schematics/angular:resolver": {
    "skipTests": false,
    "flat": false
  },
  "@schematics/angular:class": {
    "skipTests": false,
    "flat": false
  },
  "@schematics/angular:interceptor": {
    "skipTests": false,
    "flat": false
  }
}
```

- Standalone components by default
- OnPush change detection
- Separate files for templates and styles
- Each artifact in its own folder
- Test files always generated

### 2. Recommended Project Structure

```
src/
  app/
    core/                # Singleton services, interceptors, guards, base models
    shared/              # Shared components, pipes, directives, utilities
    modules/
      feature1/          # Each feature in its own module
        components/
        services/
        models/
        feature1.routes.ts
      feature2/
        ...
    layouts/             # App shell, main layout, auth layout, etc.
    assets/
    environments/
  styles/                # Global SCSS, variables, mixins
```

### 3. Example: Generating a Standalone Component

```sh
ng generate component modules/example/components/example-widget --standalone --change-detection OnPush
```

This will create:
```
src/app/modules/example/components/example-widget/
  example-widget.component.ts
  example-widget.component.html
  example-widget.component.scss
  example-widget.component.spec.ts
```

### 4. Best Practices
- Use path aliases in `tsconfig.json` for all major folders (`@core`, `@shared`, `@modules`, etc.)
- Enable strict mode in TypeScript
- Use Jest for unit testing
- Use Storybook for UI component development (optional)
- Document your architecture and conventions in the README or a `docs/` folder

---
