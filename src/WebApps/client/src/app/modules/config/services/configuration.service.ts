import {
  ConfigurationStep,
  SETUP_STEPS,
  SetupStatus,
} from '@modules/config/data/models/configuration.model';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configurationSteps$ = new BehaviorSubject<ConfigurationStep[]>(SETUP_STEPS);
  private currentStep$ = new BehaviorSubject<number | null>(null);
  private readonly router = inject(Router);

  constructor() {
    this.initializeSetup();
  }

  get steps$(): Observable<ConfigurationStep[]> {
    return this.configurationSteps$.asObservable();
  }

  get currentStep(): Observable<number | null> {
    return this.currentStep$.asObservable();
  }

  private initializeSetup(): void {
    const savedSteps = this.loadFromStorage();
    if (savedSteps) {
      this.configurationSteps$.next(savedSteps);
    }

    // Set current step to first incomplete mandatory step
    const setupStatus = this.getSetupStatus();
    if (setupStatus.nextIncompleteStep) {
      this.currentStep$.next(setupStatus.nextIncompleteStep);
    }
  }

  getSetupStatus(): SetupStatus {
    const steps = this.configurationSteps$.value;
    const mandatorySteps = steps.filter((step) => step.mandatory);
    const completedMandatorySteps = mandatorySteps.filter((step) => step.isCompleted);
    const allSteps = steps.length;
    const completedSteps = steps.filter((step) => step.isCompleted).length;

    const nextIncompleteStep = steps.find((step) => step.mandatory && !step.isCompleted);

    return {
      isCompleted: completedMandatorySteps.length === mandatorySteps.length,
      nextIncompleteStep: nextIncompleteStep?.id,
      completionPercentage: Math.round((completedSteps / allSteps) * 100),
      mandatoryStepsCompleted: completedMandatorySteps.length,
      totalMandatorySteps: mandatorySteps.length,
      canSkip: !nextIncompleteStep?.mandatory,
    };
  }

  getStepByRoute(route: string): ConfigurationStep | undefined {
    return this.configurationSteps$.value.find((step) => step.route === route);
  }
  getStepById(id: number): ConfigurationStep | undefined {
    return this.configurationSteps$.value.find((step) => step.id === id);
  }

  completeStep(stepId: number): void {
    const steps = this.configurationSteps$.value.map((step) =>
      step.id === stepId ? { ...step, isCompleted: true } : step,
    );

    this.configurationSteps$.next(steps);
    this.saveToStorage(steps);

    // Navigate to next incomplete step or dashboard
    this.navigateToNextStep();
  }

  navigateToNextStep(): void {
    const setupStatus = this.getSetupStatus();

    if (setupStatus.nextIncompleteStep) {
      const nextStep = this.configurationSteps$.value.find(
        (step) => step.id === setupStatus.nextIncompleteStep,
      );
      if (nextStep) {
        this.currentStep$.next(nextStep.id);
        this.router.navigate([nextStep.route]);
      }
    } else {
      // All mandatory steps completed, go to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToStep(stepId: number): void {
    const step = this.configurationSteps$.value.find((s) => s.id === stepId);
    if (step) {
      this.currentStep$.next(stepId);
      this.router.navigate([step.route]);
    }
  }

  skipOptionalSetup(): void {
    // Mark all mandatory steps as current focus
    const setupStatus = this.getSetupStatus();
    if (setupStatus.isCompleted) {
      this.router.navigate(['/dashboard']);
    } else {
      this.navigateToNextStep();
    }
  }

  finishSetup(): void {
    // Mark setup as completed in user preferences
    localStorage.setItem('setupCompleted', 'true');
    this.router.navigate(['/dashboard']);
  }

  resetSetup(): void {
    const resetSteps = SETUP_STEPS.map((step) => ({
      ...step,
      isCompleted: step.id === 1, // Only first step remains completed
    }));

    this.configurationSteps$.next(resetSteps);
    this.saveToStorage(resetSteps);
    localStorage.removeItem('setupCompleted');
  }

  private saveToStorage(steps: ConfigurationStep[]): void {
    localStorage.setItem('configurationSteps', JSON.stringify(steps));
  }

  private loadFromStorage(): ConfigurationStep[] | null {
    const saved = localStorage.getItem('configurationSteps');
    return saved ? JSON.parse(saved) : null;
  }

  // Check if user should see setup based on completion status
  shouldShowSetup(): boolean {
    const setupCompleted = localStorage.getItem('setupCompleted');
    const setupStatus = this.getSetupStatus();

    return !setupCompleted && !setupStatus.isCompleted;
  }

  // Get steps grouped by mandatory/optional
  getGroupedSteps(): { mandatory: ConfigurationStep[]; optional: ConfigurationStep[] } {
    const steps = this.configurationSteps$.value;
    return {
      mandatory: steps.filter((step) => step.mandatory),
      optional: steps.filter((step) => !step.mandatory),
    };
  }
}
