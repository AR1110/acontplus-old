import { ConfigurationStep, SetupStatus } from '@modules/config/data/models/configuration.model';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ShepherdTourService } from '../../services/shepherd-tour.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

// Angular Material imports
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-setup-dashboard',
  imports: [
    DynamicCard,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './setup-dashboard.component.html',
  styleUrl: './setup-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupDashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly configService = inject(ConfigurationService);
  private readonly tourService = inject(ShepherdTourService);

  setupStatus: SetupStatus = {
    isCompleted: false,
    completionPercentage: 0,
    mandatoryStepsCompleted: 0,
    totalMandatorySteps: 0,
    canSkip: false,
  };

  mandatorySteps: ConfigurationStep[] = [];
  optionalSteps: ConfigurationStep[] = [];
  currentStepId: number | null = null;

  ngOnInit(): void {
    this.loadConfigurationData();
    this.checkIfShouldShowTour();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConfigurationData(): void {
    // Load setup status
    this.setupStatus = this.configService.getSetupStatus();

    // Load grouped steps
    const groupedSteps = this.configService.getGroupedSteps();
    this.mandatorySteps = groupedSteps.mandatory;
    this.optionalSteps = groupedSteps.optional;

    // Subscribe to current step changes
    this.configService.currentStep.pipe(takeUntil(this.destroy$)).subscribe((stepId) => {
      this.currentStepId = stepId;
      this.updateStepStates();
    });
  }

  private updateStepStates(): void {
    // Update current step indicator
    this.mandatorySteps = this.mandatorySteps.map((step) => ({
      ...step,
      isCurrent: step.id === this.currentStepId,
    }));

    this.optionalSteps = this.optionalSteps.map((step) => ({
      ...step,
      isCurrent: step.id === this.currentStepId,
    }));
  }

  navigateToStep(step: ConfigurationStep): void {
    this.configService.navigateToStep(step.id);
  }

  skipOptionalSetup(): void {
    this.configService.skipOptionalSetup();
  }

  finishSetup(): void {
    this.configService.finishSetup();
  }

  startTour(): void {
    this.tourService.startTour();
  }

  private checkIfShouldShowTour(): void {
    const hasSeenTour = localStorage.getItem('hasSeenSetupTour');
    if (!hasSeenTour) {
      setTimeout(() => {
        this.startTour();
        localStorage.setItem('hasSeenSetupTour', 'true');
      }, 1000);
    }
  }

  getStepStatusIcon(step: ConfigurationStep): string {
    if (step.isCompleted) {
      return 'fas fa-check-circle text-success';
    } else if (step.isCurrent) {
      return 'fas fa-play-circle text-primary';
    } else {
      return 'far fa-circle text-muted';
    }
  }

  getStepStatusText(step: ConfigurationStep): string {
    if (step.isCompleted) {
      return 'Completado';
    } else if (step.isCurrent) {
      return 'En progreso';
    } else {
      return 'Pendiente';
    }
  }

  canProceedToNextStep(): boolean {
    return this.setupStatus.mandatoryStepsCompleted === this.setupStatus.totalMandatorySteps;
  }
}
