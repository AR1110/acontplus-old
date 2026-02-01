# AcontPlus Angular Client

AcontPlus is a modern, modular business management platform built with Angular 20+. It provides a comprehensive suite of features for accounting, inventory, sales, technical support, restaurant, barber shop, veterinary, and more. The client application is designed for scalability, maintainability, and a seamless user experience, leveraging the latest Angular features and best practices.

## 📋 Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Deployment](#-deployment)
- [Hybrid Authentication (Legacy Migration)](#-hybrid-authentication-legacy-migration)
- [Running Tests](#running-tests-jest--angular-20)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Angular 20+ Modern Features](#angular-20-modern-features)
- [Code Organization Guidelines](#code-organization-guidelines)
- [Performance & Build Speed](#angular-20-performance--build-speed-recommendations)
- [Code Quality & Linting](#code-quality--linting)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## ✨ Features

- **Modular architecture** (accounting, inventory, sales, technical support, restaurant, barber shop, veterinary, etc.)
- **Standalone Angular components** with modern dependency injection
- **Angular 20+ features**: Signals, Control Flow Syntax (@if/@for), inject() function
- **Domain-Driven Design (DDD)** architecture for complex modules
- **Modern state management** using native Angular Signals (no NgRx dependency)
- **Fast, reliable testing** with Jest (ESM support)
- **Path aliasing** for clean imports (@core, @shared, @modules)
- **Responsive UI and theming** with Material Design
- **OnPush change detection** for optimal performance
- **Typed reactive forms** with strict type safety
- **Comprehensive error handling** with user-friendly feedback

---

## 🚀 Getting Started

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
- Hot Module Replacement (HMR) is enabled for instant updates.

### 3. Build for production

```sh
npm run production
```

- Output will be in the `dist/` directory.

---

## � Deployment

This application is deployed to **AWS S3 + CloudFront** using **Azure Pipelines** for CI/CD.

### Production URL

- **Domain**: [https://client.acontplus.com](https://client.acontplus.com)

### AWS Resources

| Resource | Name | Purpose |
|----------|------|---------|
| S3 Bucket | `acontplus-prd-web-client-s3` | Hosts static build artifacts |
| CloudFront | `acp-prd-web-client-cf` | CDN distribution |

### CI/CD Pipeline

The deployment is fully automated via Azure Pipelines:

- **Trigger**: Push to `main` branch (only changes in `src/WebApps/client/**`)
- **Pipeline file**: [azure-pipelines-client.yml](../../../azure-pipelines-client.yml)
- **Documentation**: [Azure DevOps Setup Guide](docs/azure-devops-setup.md)

### Manual Deployment

For manual deployment (emergencies only):

```bash
# Build production bundle
pnpm run production

# Sync to S3 (static assets with long cache)
aws s3 sync dist/client s3://acontplus-prd-web-client-s3 \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "index.html" \
  --exclude "*.json"

# Upload index.html (no cache)
aws s3 cp dist/client/index.html s3://acontplus-prd-web-client-s3/index.html \
  --cache-control "no-cache,no-store,must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

### Deployment Documentation

- **Infrastructure Guide**: [S3 + CloudFront Deployment Guide](../../docs/Deployment/s3-cloudfront/s3-cloudfront-deployment-guide.md)
- **CI/CD Setup**: [Azure DevOps Setup](docs/azure-devops-setup.md)

---

## �🔐 Hybrid Authentication (Legacy Migration)

This application implements a **hybrid authentication system** that allows coexistence of legacy Razor Pages and modern Angular during the migration process.

### Key Features

- **Legacy Routes (No Layout)**: Routes from Razor Pages load without Angular layout (`/legacy/...`)
- **Modern Routes (With Layout)**: Native Angular routes load with full layout (header, sidebar, footer)
- **Seamless Migration**: Both systems work simultaneously without conflicts

### Quick Overview

| Access Method    | URL Example                                                | Layout | Purpose                   |
| ---------------- | ---------------------------------------------------------- | ------ | ------------------------- |
| Legacy (Razor)   | `/?token=xxx&route=Articulo` → `/legacy/inventory/product` | ❌ No  | Production legacy system  |
| Modern (Angular) | `/inventory/product`                                       | ✅ Yes | Modern Angular navigation |

### How It Works

**Legacy Flow:**

```
Razor Page → Query Params (token, route, permissions)
  → app.ts processes auth
  → Redirects to /legacy/{route}
  → LegacyLayout (empty, no UI)
  → Component renders alone
```

**Modern Flow:**

```
Direct Angular navigation → /inventory/product
  → HybridAuthGuard validates token
  → AdminLayout loads (header, sidebar, footer)
  → Component renders inside layout
```

### Documentation

For detailed information about the hybrid authentication system:

- **📘 Complete Guide**: `docs/HYBRID-AUTH-GUIDE.md` - Guía completa consolidada con toda la información sobre el sistema de autenticación híbrida

### Key Components

- **`LegacyLayoutComponent`**: Empty layout for legacy routes (no header/sidebar)
- **`hybridAuthGuard`**: Guard handling both legacy and modern authentication
- **`RouteMigrationService`**: Tracks migration progress
- **`GlobalRoutes`**: Enum mapping legacy routes to Angular routes

### Testing Legacy Auth

```bash
# Test legacy authentication flow
http://localhost:4200/?token=YOUR_TOKEN&route=Articulo&permission={...}

# Verify:
# ✅ Token saved to localStorage
# ✅ Redirects to /legacy/inventory/product
# ✅ Component loads WITHOUT layout
# ✅ No header, sidebar, or footer visible
```

### Migration Progress

Routes can be progressively migrated from legacy to modern. Each route exists in both systems:

- `/legacy/inventory/product` - Legacy access (no layout)
- `/inventory/product` - Modern access (with layout)

This allows gradual migration without breaking existing Razor Pages integration.

---

## 🧪 Running Tests (Jest + Angular 20+)

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
- Mock providers for any required dependencies in your test setup (see `app.spec.ts` for an example).

---

## 📁 Project Structure

```
src/
  app/
    core/                # Singleton services, interceptors, guards, base models
      bootstrap/         # Bootstrap services for application initialization
      components/        # Core reusable components
      services/          # Core singleton services
      guards/            # Route guards
      interceptors/      # HTTP interceptors
      models/            # Core domain models
      utils/             # Utility functions

    shared/              # Shared components, pipes, directives, utilities
      components/        # Shared UI components
      directives/        # Custom directives
      services/          # Shared services
      models/            # Shared models
      store/             # Shared state management

    modules/             # Feature modules
      auth/              # Authentication module
      accounting/        # Accounting module
      inventory/         # Inventory module
      sale/              # Sales module
      config/            # Configuration module (DDD example)
        domain/          # Domain layer (models, value objects, repositories)
        application/     # Application layer (use cases, state management)
        data/            # Data layer (repository implementations)
        ui/              # Presentation layer (components)
      [other modules...]

    layouts/             # App shell, main layout, auth layout, etc.
      admin-layout/
      auth-layout/

  assets/                # Static assets (images, icons, etc.)
  environments/          # Environment configurations
  styles/                # Global SCSS, variables, mixins
```

---

## 🏗️ Architecture

### Domain-Driven Design (DDD)

Complex modules in this application follow DDD principles with clear separation of concerns:

#### **Domain Layer**

- **Models & Aggregates**: Core business entities with validation logic
- **Value Objects**: Immutable objects with business validation
- **Repository Interfaces**: Contracts for data access

#### **Application Layer**

- **Use Cases**: Business logic and orchestration
- **State Management**: Modern stores using Angular Signals
- **DTOs**: Data transfer objects

#### **Data Layer**

- **Repository Implementations**: HTTP client integration and data mapping
- **Data Models**: API response/request models

#### **Presentation Layer**

- **Components**: UI components with modern Angular patterns
- **Templates**: Modern template syntax (@if, @for)
- **Forms**: Typed reactive forms

### Core Services (Bootstrap)

The services in `src/app/core/bootstrap/` are singleton services used for:

- Application initialization
- Sharing data and functionality across the application
- Core infrastructure setup

---

## 🆕 Angular 20+ Modern Features

This project leverages the latest Angular 20+ features for optimal performance and developer experience.

### 1. **Modern Control Flow Syntax**

```typescript
// ✅ Modern @if syntax
@if (isLoading()) {
  <div class="loading">Loading...</div>
} @else {
  <div class="content">{{ content() }}</div>
}

// ✅ Modern @for syntax with trackBy
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

// ✅ Modern @switch syntax
@switch (status()) {
  @case ('loading') {
    <loading-spinner />
  }
  @case ('success') {
    <success-message />
  }
  @default {
    <error-message />
  }
}
```

### 2. **Modern Dependency Injection with inject()**

```typescript
// ✅ Modern injection pattern
export class MyComponent {
  private readonly _service = inject(MyService);
  private readonly _fb = inject(FormBuilder);

  // No constructor needed!
}

// ❌ Old pattern (avoid)
export class MyComponent {
  constructor(
    private service: MyService,
    private fb: FormBuilder,
  ) {}
}
```

### 3. **Angular Signals for Reactive State**

```typescript
// ✅ Signal-based state management
export class MyComponent {
  // Data signals
  readonly users = signal<User[]>([]);
  readonly isLoading = signal(false);

  // Computed signals for derived state
  readonly hasUsers = computed(() => this.users().length > 0);
  readonly userCount = computed(() => this.users().length);

  // Signal updates
  addUser(user: User): void {
    this.users.update((users) => [...users, user]);
  }
}
```

### 4. **Native Signal Stores (Recommended over NgRx)**

```typescript
@Injectable({ providedIn: 'root' })
export class UserStore {
  // Signal state
  readonly users = signal<User[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Computed signals
  readonly activeUsers = computed(() => this.users().filter((u) => u.isActive));

  // Dependencies
  private readonly _service = inject(UserService);
  private readonly _destroyRef = inject(DestroyRef);

  // Methods
  loadUsers(): void {
    this.isLoading.set(true);
    this._service
      .getUsers()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
          this.isLoading.set(false);
        },
      });
  }
}
```

**Why Native Signals over NgRx?**

- ✅ No external dependencies - built into Angular core
- ✅ Better performance - optimized by Angular team
- ✅ Smaller bundle size - no NgRx overhead
- ✅ Simpler syntax - direct signal manipulation
- ✅ Future-proof - official Angular approach
- ✅ Easier testing - fewer moving parts

### 5. **OnPush Change Detection**

```typescript
@Component({
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Better performance
  // ...
})
export class MyComponent {
  // Component uses signals for reactive updates
}
```

### 6. **Typed Reactive Forms**

```typescript
interface UserFormControls {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
}

export class UserFormComponent {
  private readonly _fb = inject(FormBuilder);

  readonly form = this._fb.group<UserFormControls>({
    firstName: this._fb.control('', [Validators.required]),
    lastName: this._fb.control('', [Validators.required]),
    email: this._fb.control('', [Validators.required, Validators.email]),
  });

  // ✅ Type-safe form access
  get firstName(): string | null {
    return this.form.controls.firstName.value;
  }
}
```

### 7. **Automatic Subscription Cleanup**

```typescript
export class MyComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _service = inject(MyService);

  loadData(): void {
    this._service
      .getData()
      .pipe(takeUntilDestroyed(this._destroyRef)) // ✅ Auto cleanup
      .subscribe((data) => {
        // Handle data
      });
  }
}
```

---

## 📝 Code Organization Guidelines

### Import Organization

Group imports in the following order with clear separators:

```typescript
// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular CDK
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Angular Material
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

// Core Components & Services
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastService } from '@core/services/toast.service';

// Shared Components
import { Button } from '@acontplus/ng-components';

// Module Services & Use Cases
import { CreateUserUseCase } from '@modules/auth/application/use-cases/create-user.use-case';

// Module Models
import { User } from '@modules/auth/domain/models/user.model';

// Utilities
import { formatDate } from '@shared/utils/date.utils';
```

### Component Structure

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

  readonly MAX_ITEMS = 100;
  readonly config = {...};

  // ============================================================================
  // SIGNAL PROPERTIES
  // ============================================================================

  readonly data = signal<Data[]>([]);
  readonly isLoading = signal(false);
  readonly hasData = computed(() => this.data().length > 0);

  // ============================================================================
  // COMPONENT STATE PROPERTIES
  // ============================================================================

  selectedItem: Item | null = null;

  // ============================================================================
  // FORM DEFINITIONS
  // ============================================================================

  form = this._fb.group({...});

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
  // EVENT HANDLERS
  // ============================================================================

  onClick(): void {...}

  // ============================================================================
  // SAVE/SUBMIT METHODS
  // ============================================================================

  save(): void {...}

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private formatData(): void {...}
}
```

### Best Practices

- **Consistency**: Once you establish a pattern, stick to it throughout your project
- **Type Safety**: Avoid `any` types, use proper TypeScript typing
- **Readonly Signals**: Use `readonly` for signals to prevent external mutations
- **Private Services**: Use `private readonly _serviceName` for injected services
- **TrackBy Functions**: Always use trackBy for @for loops for better performance
- **Section Separators**: Use clear section separators to improve readability

---

## ⚡ Angular 20+ Performance & Build Speed Recommendations

This project implements several optimizations for the fastest possible development and build experience:

### 1. **Persistent Build Cache**

- Angular CLI persistent cache is enabled in `angular.json` for faster rebuilds

### 2. **Incremental TypeScript Builds**

- `tsconfig.json` uses `"incremental": true` for faster TypeScript compilation

### 3. **Modern JavaScript Output**

- Target and module set to `ES2022` for smaller bundles and less polyfill overhead

### 4. **Hot Module Replacement (HMR)**

- HMR enabled by default for instant updates without full reloads

### 5. **Standalone Components & Signals**

- Components default to `standalone: true` with Angular signals for reduced overhead

### 6. **Angular Compiler Optimizations**

- `enableResourceInlining` enabled for better tree-shaking
- Strict compiler options enforced

### 7. **Modern Module Resolution**

- Uses `moduleResolution: "bundler"` for optimal Angular 20+ compatibility

### Performance Tips

- Use OnPush change detection strategy
- Implement trackBy functions for all loops
- Leverage computed signals for derived state
- Use takeUntilDestroyed() for automatic subscription cleanup
- Lazy load feature modules when possible

---

## ✅ Code Quality & Linting

This project uses ESLint with TypeScript and Angular-specific rules.

### Running Lint Checks

```sh
# Check for linting issues
ng lint

# Automatically fix issues
ng lint --fix
```

### Common Linting Issues & Solutions

#### 1. **Unexpected any type**

```typescript
// ❌ Bad
data: any = {};

// ✅ Good
data: User = {};
```

#### 2. **Prefer inject() over constructor injection**

```typescript
// ❌ Bad
constructor(private userService: UserService) {}

// ✅ Good
private readonly _userService = inject(UserService);
```

#### 3. **Empty lifecycle methods**

```typescript
// ❌ Bad
ngOnInit(): void {}

// ✅ Good - Remove empty methods or add implementation
ngOnInit(): void {
  this.loadData();
}
```

#### 4. **Unused variables**

```typescript
// ❌ Bad
function processData(data: User[], index: number) {
  return data.map((user) => user.name);
}

// ✅ Good - Use underscore prefix for intentionally unused parameters
function processData(data: User[], _index: number) {
  return data.map((user) => user.name);
}
```

#### 5. **Output naming conventions**

```typescript
// ❌ Bad
@Output() onSelect = new EventEmitter<User>();

// ✅ Good
@Output() userSelected = new EventEmitter<User>();
```

#### 6. **Accessibility issues**

```html
<!-- ❌ Bad -->
<div (click)="handleClick()">Click me</div>

<!-- ✅ Good -->
<button (click)="handleClick()">Click me</button>
```

### IDE Integration

- **VS Code**: Install the ESLint extension
- **WebStorm**: ESLint is built-in and enabled by default

---

## 🔧 Troubleshooting

- If you see errors about missing providers, add mocks for those dependencies in your test's `providers` array
- For ESM/Angular/Jest issues, ensure you are using the latest versions of Angular, Jest, and `jest-preset-angular`
- For performance issues, ensure OnPush change detection is used and signals are leveraged properly
- For build speed issues, clear the Angular cache: `rm -rf .angular/cache`

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🔧 Schematics Configuration & Code Generation

The project is configured to generate components with modern best practices by default.

### Schematics Configuration (angular.json)

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
  }
}
```

Features:

- Standalone components by default
- OnPush change detection
- Separate files for templates and styles
- Each artifact in its own folder
- Test files always generated

### Example: Generating a Component

```sh
ng generate component modules/example/components/example-widget
```

This will create:

```
src/app/modules/example/components/example-widget/
  example-widget.component.ts
  example-widget.component.html
  example-widget.component.scss
  example-widget.component.spec.ts
```

---

## 📚 Additional Resources

- [Angular 20+ Official Documentation](https://angular.io/)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Angular Typed Forms](https://angular.io/guide/typed-forms)
- [Angular Control Flow](https://angular.io/guide/control-flow)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Angular Style Guide](https://angular.io/guide/styleguide)

---

## 🤝 Contributing

Please follow the code organization guidelines and best practices outlined in this README when contributing to the project.

1. Use modern Angular 20+ features (signals, @if/@for, inject())
2. Follow the DDD architecture for complex modules
3. Write unit tests for all new features
4. Run linting before committing: `ng lint --fix`
5. Ensure type safety - avoid `any` types
6. Use OnPush change detection strategy
7. Document complex logic with comments

---
