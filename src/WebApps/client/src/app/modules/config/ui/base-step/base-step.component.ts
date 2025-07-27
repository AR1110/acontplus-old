import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationService } from '@modules/config/services/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseStepComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected stepId = 0;
  protected isLoading = false;
  protected hasUnsavedChanges = false;
  protected configService = inject(ConfigurationService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.stepId = this.route.snapshot.data['stepId'] || 0;
    this.initializeStep();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract initializeStep(): void;
  protected abstract validateStep(): boolean;
  protected abstract saveStepData(): Promise<boolean>;

  async completeStep(): Promise<void> {
    if (!this.validateStep()) {
      return;
    }

    this.isLoading = true;

    try {
      const success = await this.saveStepData();

      if (success) {
        this.configService.completeStep(this.stepId);
        this.hasUnsavedChanges = false;
        // Navigation will be handled by ConfigurationService
      }
    } catch (error) {
      console.error('Error saving step data:', error);
      // Handle error (show notification, etc.)
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/setup']);
  }

  skipStep(): void {
    // Only allow skipping optional steps
    const currentStep = this.configService.getStepById(this.stepId);
    if (currentStep && !currentStep.mandatory) {
      this.configService.navigateToNextStep();
    }
  }

  // CanDeactivate guard helper
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.');
    }
    return true;
  }
}
