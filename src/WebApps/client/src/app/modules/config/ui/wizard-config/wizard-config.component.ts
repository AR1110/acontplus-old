// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import { Component, inject, ViewChild, effect } from '@angular/core';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatFormField, MatLabel, MatError } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { UserStepComponent } from './components/user-step/user-step.component';
import { EstablishmentStepComponent } from './components/establishment-step/establishment-step.component';
import { WizardConfigStore } from '@modules/config/application/store/wizard-config.store';

@Component({
  selector: 'app-wizard-config', 
  imports: [
    MatStepper,
    MatStep,
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatProgressBar,
    MatFormField,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatInput,
    BreadcrumbComponent,
    UserStepComponent,
    EstablishmentStepComponent,
  ],
  templateUrl: './wizard-config.component.html',

})
export class WizardConfigComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  private readonly _store = inject(WizardConfigStore);

  // Signals from store
  readonly isLoading = this._store.isLoading;
  readonly steps = this._store.steps;
  readonly currentStepIndex = this._store.currentStepIndex;
  readonly totalStepsCount = this._store.totalStepsCount;
  readonly progressPercentage = this._store.progressPercentage;
  readonly canProceedToNextStep = this._store.canProceedToNextStep;
  readonly canGoToPreviousStep = this._store.canGoToPreviousStep;
  readonly hasIncompleteRequiredSteps = this._store.hasIncompleteRequiredSteps;
  readonly isLinear = this._store.isLinear;
  readonly allowSkip = this._store.allowSkip;
  readonly hasError = this._store.hasError;
  readonly error = this._store.error;
  readonly isAnySaving = this._store.isAnySaving;

  constructor() {
    // Auto-load configuration when component initializes
    effect(() => {
      if (!this._store.configuration()) {
        this._store.loadWizardConfiguration();
      }
    });
  }

  onStepChange(stepIndex: number): void {
    this._store.moveToStep(stepIndex);
  }

  moveToNextStep(): void {
    this._store.moveToNextStep();
  }

  moveToPreviousStep(): void {
    this._store.moveToPreviousStep();
  }

  skipStep(): void {
    // TODO: Implement skip logic
    this._store.completeCurrentStep();
    this.moveToNextStep();
  }

  finishWizard(): void {
    // TODO: Implement finish logic
    console.log('Wizard completed!');
  }

  clearError(): void {
    this._store.clearError();
  }

  getStepState(step: { isCompleted: boolean; isEnabled: boolean }): string {
    if (step.isCompleted) return 'done';
    if (!step.isEnabled) return 'disabled';
    return 'default';
  }
}
