import { WizardStep, WizardStepData } from './wizard-step.model';

export interface WizardConfigurationData {
  readonly id: string;
  readonly steps: WizardStep[];
  readonly currentStepIndex: number;
  readonly isLinear: boolean;
  readonly allowSkip: boolean;
  readonly autoSave: boolean;
  readonly metadata: Record<string, unknown>;
}

export class WizardConfiguration {
  private readonly _data: WizardConfigurationData;

  constructor(data: WizardConfigurationData) {
    this._data = data;
  }

  get id(): string {
    return this._data.id;
  }

  get steps(): WizardStep[] {
    return [...this._data.steps];
  }

  get currentStepIndex(): number {
    return this._data.currentStepIndex;
  }

  get isLinear(): boolean {
    return this._data.isLinear;
  }

  get allowSkip(): boolean {
    return this._data.allowSkip;
  }

  get autoSave(): boolean {
    return this._data.autoSave;
  }

  get metadata(): Record<string, unknown> {
    return { ...this._data.metadata };
  }

  get currentStep(): WizardStep | null {
    return this.steps[this.currentStepIndex] || null;
  }

  get nextStep(): WizardStep | null {
    const nextIndex = this.currentStepIndex + 1;
    return nextIndex < this.steps.length ? this.steps[nextIndex] : null;
  }

  get previousStep(): WizardStep | null {
    const prevIndex = this.currentStepIndex - 1;
    return prevIndex >= 0 ? this.steps[prevIndex] : null;
  }

  get completedSteps(): WizardStep[] {
    return this.steps.filter(step => step.isCompleted);
  }

  get completedStepsCount(): number {
    return this.completedSteps.length;
  }

  get totalStepsCount(): number {
    return this.steps.length;
  }

  get progressPercentage(): number {
    if (this.totalStepsCount === 0) return 0;
    return Math.round((this.completedStepsCount / this.totalStepsCount) * 100);
  }

  get canProceedToNextStep(): boolean {
    const currentStep = this.currentStep;
    if (!currentStep) return false;

    const completedStepIds = this.completedSteps.map(step => step.id);
    return currentStep.canProceed() && currentStep.validateDependencies(completedStepIds);
  }

  get canGoToPreviousStep(): boolean {
    return this.currentStepIndex > 0;
  }

  get hasIncompleteRequiredSteps(): boolean {
    return this.steps
      .filter(step => step.isRequired)
      .some(step => !step.isCompleted);
  }

  moveToNextStep(): WizardConfiguration {
    if (!this.canProceedToNextStep) {
      throw new Error('Cannot proceed to next step');
    }

    return new WizardConfiguration({
      ...this._data,
      currentStepIndex: this.currentStepIndex + 1
    });
  }

  moveToPreviousStep(): WizardConfiguration {
    if (!this.canGoToPreviousStep) {
      throw new Error('Cannot go to previous step');
    }

    return new WizardConfiguration({
      ...this._data,
      currentStepIndex: this.currentStepIndex - 1
    });
  }

  moveToStep(stepIndex: number): WizardConfiguration {
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      throw new Error('Invalid step index');
    }

    return new WizardConfiguration({
      ...this._data,
      currentStepIndex: stepIndex
    });
  }

  completeCurrentStep(): WizardConfiguration {
    const currentStep = this.currentStep;
    if (!currentStep) {
      throw new Error('No current step to complete');
    }

    const updatedSteps = this.steps.map((step, index) =>
      index === this.currentStepIndex ? step.markAsCompleted() : step
    );

    return new WizardConfiguration({
      ...this._data,
      steps: updatedSteps
    });
  }

  updateStep(stepId: string, updates: Partial<WizardStepData>): WizardConfiguration {
    const updatedSteps = this.steps.map(step =>
      step.id === stepId ? new WizardStep({ ...step.toJSON(), ...updates }) : step
    );

    return new WizardConfiguration({
      ...this._data,
      steps: updatedSteps
    });
  }

  enableStep(stepId: string): WizardConfiguration {
    return this.updateStep(stepId, { isEnabled: true });
  }

  disableStep(stepId: string): WizardConfiguration {
    return this.updateStep(stepId, { isEnabled: false });
  }

  reset(): WizardConfiguration {
    const resetSteps = this.steps.map(step => step.markAsIncomplete());

    return new WizardConfiguration({
      ...this._data,
      steps: resetSteps,
      currentStepIndex: 0
    });
  }

  isStepAccessible(stepIndex: number): boolean {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return false;

    const step = this.steps[stepIndex];
    if (!step.isEnabled) return false;

    const completedStepIds = this.completedSteps.map(s => s.id);
    return step.validateDependencies(completedStepIds);
  }

  getStepById(stepId: string): WizardStep | null {
    return this.steps.find(step => step.id === stepId) || null;
  }

  getStepByCode(stepCode: string): WizardStep | null {
    return this.steps.find(step => step.code === stepCode) || null;
  }

  toJSON(): WizardConfigurationData {
    return {
      ...this._data,
      steps: this.steps
    };
  }

  static createDefault(): WizardConfiguration {
    const defaultSteps = [
      new WizardStep({
        id: 'welcome',
        code: 'I',
        name: 'Bienvenida',
        description: 'Paso de bienvenida al asistente',
        order: 1,
        isRequired: true,
        isCompleted: true,
        isEnabled: true,
        validationRules: [],
        dependencies: [],
        metadata: {}
      }),
      new WizardStep({
        id: 'user',
        code: 'II',
        name: 'Usuario',
        description: 'Configuración de datos del usuario',
        order: 2,
        isRequired: true,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: ['welcome'],
        metadata: {}
      }),
      new WizardStep({
        id: 'establishment',
        code: 'III',
        name: 'Establecimiento',
        description: 'Configuración del establecimiento',
        order: 3,
        isRequired: true,
        isCompleted: false,
        isEnabled: false,
        validationRules: [],
        dependencies: ['user'],
        metadata: {}
      }),
      new WizardStep({
        id: 'contribuyente',
        code: 'IV',
        name: 'Contribuyente',
        description: 'Configuración del tipo de contribuyente',
        order: 4,
        isRequired: true,
        isCompleted: false,
        isEnabled: false,
        validationRules: [],
        dependencies: ['establishment'],
        metadata: {}
      }),
      new WizardStep({
        id: 'documents',
        code: 'V',
        name: 'Documentos',
        description: 'Configuración de documentos electrónicos',
        order: 5,
        isRequired: true,
        isCompleted: false,
        isEnabled: false,
        validationRules: [],
        dependencies: ['contribuyente'],
        metadata: {}
      }),
      new WizardStep({
        id: 'certificate',
        code: 'VI',
        name: 'Certificado',
        description: 'Configuración de firma electrónica',
        order: 6,
        isRequired: false,
        isCompleted: false,
        isEnabled: false,
        validationRules: [],
        dependencies: ['documents'],
        metadata: {}
      })
    ];

    return new WizardConfiguration({
      id: 'default-wizard',
      steps: defaultSteps,
      currentStepIndex: 0,
      isLinear: true,
      allowSkip: false,
      autoSave: true,
      metadata: {}
    });
  }
}
