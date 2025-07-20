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

## Angular Component Code Organization Guidelines

This section provides comprehensive guidelines for organizing Angular component code to ensure maintainability, readability, and consistency across the project.

### 1. Import Organization

Group imports in the following order with clear separators:

```typescript
// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import { Component, inject, ViewChild, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular CDK
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Angular Material
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';

// Third-party Libraries
import Swal from 'sweetalert2';
import { faIcon } from '@fortawesome/free-solid-svg-icons';

// Core Components & Services
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastService } from '@core/services/toast.service';

// Shared Components & Directives
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

// Module Services & Use Cases
import { UserService } from '@modules/auth/services/user.service';
import { CreateUserUseCase } from '@modules/auth/application/use-cases/create-user.use-case';

// Module Models
import { User } from '@modules/auth/domain/models/user.model';

// Utilities
import { formatDate } from '@shared/utils/date.utils';
```

### 2. Component Structure (Top to Bottom)

Organize your component in this specific order:

```typescript
@Component({...})
export class MyComponent implements OnInit {
  
  // ============================================================================
  // VIEW CHILD & INJECTIONS
  // ============================================================================
  
  @ViewChild('element') element!: ElementRef;
  private readonly _service = inject(Service);
  
  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================
  
  readonly CONSTANT = 'value';
  readonly config = {...};
  
  // ============================================================================
  // SIGNAL PROPERTIES (Angular 17+)
  // ============================================================================
  
  // Data signals
  users = signal<User[]>([]);
  products = signal<Product[]>([]);
  
  // UI state signals
  isLoading = signal(false);
  selectedUser = signal<User | null>(null);
  
  // ============================================================================
  // COMPONENT STATE PROPERTIES
  // ============================================================================
  
  isLoading = false;
  selectedItem: Item | null = null;
  
  // ============================================================================
  // FORM DEFINITIONS
  // ============================================================================
  
  form = this.fb.group({...});
  
  // ============================================================================
  // FORM GETTERS
  // ============================================================================
  
  get formArray(): FormArray { return this.form.get('array') as FormArray; }
  
  // ============================================================================
  // LIFECYCLE METHODS
  // ============================================================================
  
  ngOnInit(): void {...}
  
  // ============================================================================
  // INITIALIZATION METHODS
  // ============================================================================
  
  private initializeData(): void {...}
  
  // ============================================================================
  // DATA FETCHING METHODS
  // ============================================================================
  
  fetchData(): void {...}
  
  // ============================================================================
  // BUSINESS LOGIC METHODS
  // ============================================================================
  
  processData(): void {...}
  
  // ============================================================================
  // FORM MANAGEMENT METHODS
  // ============================================================================
  
  addItem(): void {...}
  removeItem(): void {...}
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  onItemClick(): void {...}
  
  // ============================================================================
  // SAVE/SUBMIT METHODS
  // ============================================================================
  
  save(): void {...}
  
  // ============================================================================
  // RESPONSE HANDLING METHODS
  // ============================================================================
  
  private handleResponse(): void {...}
  
  // ============================================================================
  // UTILITY METHODS
  // ============================================================================
  
  private formatData(): void {...}
}
```

### 3. Method Organization Principles

#### Public vs Private Methods
- Keep public methods at the top of each section
- Group private methods at the bottom
- Use clear naming conventions

#### Method Grouping by Responsibility
```typescript
// Data Management
fetchData(): void {...}
updateData(): void {...}
deleteData(): void {...}

// Form Management
addFormControl(): void {...}
removeFormControl(): void {...}
validateForm(): void {...}

// UI Management
showLoading(): void {...}
hideLoading(): void {...}
updateUI(): void {...}

// Event Handling
onClick(): void {...}
onChange(): void {...}
onSubmit(): void {...}
```

### 4. Form Organization

```typescript
// Group form-related code together
form = this.fb.group({...});

// Form getters
get formArray(): FormArray { return this.form.get('array') as FormArray; }

// Form factory methods
private createFormGroup(): FormGroup { return this.fb.group({...}); }

// Form management methods
addItem(): void {...}
removeItem(): void {...}
validateForm(): void {...}
```

### 5. Service Injection Best Practices

```typescript
// Use private readonly for all injections
private readonly _dataService = inject(DataService);
private readonly _toastService = inject(ToastService);

// Group related services together
// Data services
private readonly _userService = inject(UserService);
private readonly _productService = inject(ProductService);

// UI services
private readonly _toastService = inject(ToastService);
private readonly _loadingService = inject(LoadingService);
```

### 6. Signal Organization (Angular 17+)

```typescript
// Data signals
users = signal<User[]>([]);
products = signal<Product[]>([]);

// UI state signals
isLoading = signal(false);
selectedUser = signal<User | null>(null);

// Form state signals
formErrors = signal<string[]>([]);
isFormValid = signal(false);
```

### 7. Error Handling Organization

```typescript
// Centralize error handling
private handleError(error: any): void {
  this._toastService.error('An error occurred');
  console.error('Error:', error);
}

// Use in methods
fetchData(): void {
  this.dataService.getData().subscribe({
    next: (data) => this.handleSuccess(data),
    error: (error) => this.handleError(error)
  });
}
```

### 8. Response Handling Patterns

```typescript
// Create dedicated response handlers
private handleSaveResponse(response: ApiResponse): void {
  if (response.success) {
    this._toastService.success(response.message);
    this.refreshData();
  } else {
    this._toastService.error(response.message);
  }
}
```

### 9. File Structure Recommendations

```
src/app/modules/feature/
├── components/
│   ├── my-component/
│   │   ├── my-component.component.ts
│   │   ├── my-component.component.html
│   │   ├── my-component.component.scss
│   │   └── my-component.component.spec.ts
├── services/
├── models/
└── utils/
```

### 10. Naming Conventions

```typescript
// Services: private readonly _serviceName
private readonly _userService = inject(UserService);

// Methods: camelCase with descriptive names
fetchUserData(): void {...}
handleUserSave(): void {...}

// Constants: UPPER_SNAKE_CASE
readonly MAX_RETRY_ATTEMPTS = 3;

// Signals: descriptive names
users = signal<User[]>([]);
isUserLoading = signal(false);
```

### 11. Comments and Documentation

```typescript
/**
 * Fetches user data from the API
 * @param userId - The ID of the user to fetch
 * @returns Observable of user data
 */
fetchUserData(userId: string): Observable<User> {
  // Implementation
}
```

### 12. Type Safety

```typescript
// Use strict typing
users = signal<User[]>([]);
selectedUser = signal<User | null>(null);

// Avoid any types
// ❌ Bad
data: any[] = [];

// ✅ Good
data: User[] = [];
```

### 13. Section Separators

Use clear section separators to improve readability:

```typescript
// ============================================================================
// SECTION NAME
// ============================================================================
```

### 14. Best Practices Summary

- **Consistency**: Once you establish a pattern, stick to it throughout your project
- **Readability**: Use clear, descriptive names for methods and properties
- **Maintainability**: Group related functionality together
- **Type Safety**: Avoid `any` types, use proper TypeScript typing
- **Documentation**: Comment complex logic and public methods
- **Separation of Concerns**: Keep business logic, UI logic, and data access separate
- **Error Handling**: Centralize error handling and provide meaningful error messages
- **Testing**: Write unit tests for all public methods and complex logic

These organizational principles will make your code more maintainable, readable, and easier to debug. The key is consistency - once you establish a pattern, stick to it throughout your project.

---
