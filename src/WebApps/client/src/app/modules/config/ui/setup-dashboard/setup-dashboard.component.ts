import { ConfigurationStep, SetupStatus } from '@modules/config/domain/models/configuration.model';
import { SetupTourComponent } from '@modules/config/ui/setup-tour/setup-tour.component';
import { ConfigurationService } from '../../services/configuration.service';
import { TourService } from '@modules/config/services/tour.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-setup-dashboard',
  imports: [SetupTourComponent],
  templateUrl: './setup-dashboard.component.html',
  styleUrl: './setup-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupDashboardComponent {
  private destroy$ = new Subject<void>();

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
  showTour = false;

  constructor(
    private configService: ConfigurationService,
    private tourService: TourService,
  ) {}

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
    this.showTour = true;
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
