# Wizard Configuration Module - DDD Architecture

This document describes the Domain-Driven Design (DDD) architecture implemented for the wizard configuration components in the config module.

## 🏗️ Architecture Overview

The wizard configuration module follows a clean DDD architecture with clear separation of concerns:

```
src/app/modules/config/
├── domain/                          # Domain Layer
│   ├── models/wizard-config/        # Domain Models & Value Objects
│   │   ├── wizard-step.model.ts     # Wizard Step Domain Model
│   │   ├── wizard-configuration.model.ts # Wizard Configuration Aggregate
│   │   └── value-objects/           # Value Objects
│   │       ├── user-data.vo.ts      # User Data Value Object
│   │       └── establishment-data.vo.ts # Establishment Data Value Object
│   └── repositories/                # Repository Interfaces
│       └── wizard-config.repository.ts
├── application/                     # Application Layer
│   ├── use-cases/wizard-config/     # Use Cases
│   │   ├── get-wizard-configuration.use-case.ts
│   │   ├── save-user-data.use-case.ts
│   │   └── save-establishment-data.use-case.ts
│   └── store/                       # State Management
│       └── wizard-config.modern.store.ts
├── data/                           # Data Layer
│   └── wizard-config/              # Repository Implementations
│       └── wizard-config.repository.impl.ts
└── ui/wizard-config/               # Presentation Layer
    ├── wizard-config.component.ts
    └── components/
        └── user-step/
            └── user-step.component.ts
```

## 🎯 Domain Layer

### Domain Models

#### WizardStep
- **Purpose**: Represents a single step in the wizard configuration process
- **Features**:
  - Immutable domain model with validation logic
  - Step completion tracking
  - Dependency management between steps
  - Validation rules encapsulation

#### WizardConfiguration
- **Purpose**: Aggregate root that manages the entire wizard configuration
- **Features**:
  - Step collection management
  - Progress tracking
  - Navigation logic
  - State validation

### Value Objects

#### UserData
- **Purpose**: Encapsulates user information with business validation
- **Features**:
  - Email and phone validation
  - Name length constraints
  - Immutable data structure

#### EstablishmentData
- **Purpose**: Encapsulates establishment information with business rules
- **Features**:
  - Establishment code validation
  - Puntos de emisión management
  - Bodega validation for inventory

## 🔧 Application Layer

### Use Cases

#### GetWizardConfigurationUseCase
- **Purpose**: Retrieves wizard configuration with fallback to defaults
- **Features**:
  - Error handling with graceful degradation
  - Default configuration creation
  - Response standardization

#### SaveUserDataUseCase
- **Purpose**: Saves user data with validation
- **Features**:
  - Domain validation
  - Business rule enforcement
  - Error handling

#### SaveEstablishmentDataUseCase
- **Purpose**: Saves establishment data with complex validation
- **Features**:
  - Establishment code uniqueness validation
  - Puntos de emisión validation
  - Bodega requirements validation

### State Management

#### WizardConfigStore
- **Purpose**: Modern state management using Angular signals
- **Features**:
  - Reactive state with signals
  - Computed values for derived state
  - Loading state management
  - Error handling
  - Auto-save functionality

## 📊 Data Layer

### Repository Implementation

#### WizardConfigRepositoryImpl
- **Purpose**: Implements data access for wizard configuration
- **Features**:
  - HTTP client integration
  - In-memory caching
  - Error handling
  - Data mapping

## 🎨 Presentation Layer

### Modern Components

#### WizardConfigComponent
- **Purpose**: Main wizard component with modern Angular practices
- **Features**:
  - Angular signals integration
  - Modern template syntax (@if, @for)
  - Accessibility features
  - Responsive design
  - Progress tracking

#### UserStepComponent
- **Purpose**: User data input step with validation
- **Features**:
  - Reactive forms with typed controls
  - Real-time validation
  - Error display
  - Loading states

## 🚀 Modern Angular Features Used

### 1. Angular Signals
```typescript
// State signals
readonly configuration = signal<WizardConfiguration | null>(null);
readonly isLoading = signal<boolean>(false);

// Computed signals
readonly progressPercentage = computed(() => 
  this.configuration()?.progressPercentage || 0
);
```

### 2. Modern Template Syntax
```html
@if (isLoading()) {
  <div class="loading">Loading...</div>
} @else {
  <div class="content">Content</div>
}

@for (step of steps(); track step.id) {
  <div>{{ step.name }}</div>
}
```

### 3. Typed Reactive Forms
```typescript
interface UserFormControls {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
}

readonly userForm = this._fb.group<UserFormControls>({
  firstName: this._fb.control('', [Validators.required]),
  lastName: this._fb.control('', [Validators.required])
});
```

### 4. Dependency Injection with inject()
```typescript
private readonly _store = inject(WizardConfigStore);
private readonly _fb = inject(FormBuilder);
```

## 🔄 Data Flow

1. **Initialization**: Store loads configuration via use case
2. **User Interaction**: Components dispatch actions to store
3. **Business Logic**: Use cases validate and process data
4. **Data Persistence**: Repository saves to backend
5. **State Update**: Store updates signals with new state
6. **UI Update**: Components reactively update via signals

## 🧪 Testing Strategy

### Unit Tests
- Domain models with business logic validation
- Use cases with mock repositories
- Value objects with edge cases

### Integration Tests
- Repository implementations with real HTTP calls
- Store integration with use cases

### Component Tests
- Component behavior with mock stores
- Form validation and user interactions

## 📋 Usage Examples

### Using the Modern Store
```typescript
@Component({
  // ...
})
export class MyComponent {
  private readonly _store = inject(WizardConfigStore);
  
  readonly steps = this._store.steps;
  readonly currentStep = this._store.currentStep;
  
  saveUserData(userData: UserData): void {
    this._store.saveUserData(userData);
  }
}
```

### Creating a New Step Component
```typescript
@Component({
  selector: 'app-my-step',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSave()">
      <!-- Form content -->
    </form>
  `
})
export class MyStepComponent {
  private readonly _store = inject(WizardConfigStore);
  private readonly _fb = inject(FormBuilder);
  
  readonly form = this._fb.group({
    // Form controls
  });
  
  onSave(): void {
    if (this.form.valid) {
      const data = new MyData(this.form.value);
      this._store.saveMyData(data);
    }
  }
}
```

## 🔧 Configuration

### Environment Setup
```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  // ... other config
};
```

### Module Registration
```typescript
// config.module.ts
import { CONFIG_PROVIDERS } from './data/data-config.ioc';

@NgModule({
  providers: CONFIG_PROVIDERS
})
export class ConfigModule { }
```

## 🎯 Benefits of This Architecture

1. **Separation of Concerns**: Clear boundaries between layers
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes are isolated to specific layers
4. **Scalability**: Easy to add new features and steps
5. **Type Safety**: Full TypeScript support throughout
6. **Performance**: Angular signals for efficient reactivity
7. **Accessibility**: Built-in accessibility features
8. **Responsive**: Mobile-first design approach

## 🔮 Future Enhancements

1. **Additional Steps**: Contribuyente, Documents, Certificate steps
2. **Validation Rules**: Dynamic validation rule loading
3. **Internationalization**: Multi-language support
4. **Offline Support**: Service worker integration
5. **Analytics**: User interaction tracking
6. **A/B Testing**: Step variation testing

## 📚 Related Documentation

- [Angular Signals Guide](https://angular.io/guide/signals)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Angular Style Guide](https://angular.io/guide/styleguide) 
