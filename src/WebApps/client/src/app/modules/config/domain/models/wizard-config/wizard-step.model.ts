export interface WizardStepData {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly isRequired: boolean;
  readonly isCompleted: boolean;
  readonly isEnabled: boolean;
  readonly validationRules: ValidationRule[];
  readonly dependencies: string[];
  readonly metadata: Record<string, any>;
}

export interface ValidationRule {
  readonly field: string;
  readonly type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  readonly value?: any;
  readonly message: string;
}

export class WizardStep {
  private readonly _data: WizardStepData;

  constructor(data: WizardStepData) {
    this._data = data;
  }

  get id(): string {
    return this._data.id;
  }

  get code(): string {
    return this._data.code;
  }

  get name(): string {
    return this._data.name;
  }

  get description(): string {
    return this._data.description;
  }

  get order(): number {
    return this._data.order;
  }

  get isRequired(): boolean {
    return this._data.isRequired;
  }

  get isCompleted(): boolean {
    return this._data.isCompleted;
  }

  get isEnabled(): boolean {
    return this._data.isEnabled;
  }

  get validationRules(): ValidationRule[] {
    return [...this._data.validationRules];
  }

  get dependencies(): string[] {
    return [...this._data.dependencies];
  }

  canProceed(): boolean {
    return this.isEnabled && (!this.isRequired || this.isCompleted);
  }

  markAsCompleted(): WizardStep {
    return new WizardStep({
      ...this._data,
      isCompleted: true
    });
  }

  markAsIncomplete(): WizardStep {
    return new WizardStep({
      ...this._data,
      isCompleted: false
    });
  }

  enable(): WizardStep {
    return new WizardStep({
      ...this._data,
      isEnabled: true
    });
  }

  disable(): WizardStep {
    return new WizardStep({
      ...this._data,
      isEnabled: false
    });
  }

  validateDependencies(completedSteps: string[]): boolean {
    return this.dependencies.every(dep => completedSteps.includes(dep));
  }

  toJSON(): WizardStepData {
    return { ...this._data };
  }
}
