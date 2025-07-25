import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { TourStep } from '@modules/config/domain/models/configuration.model';
import { TourService } from '@modules/config/services/tour.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-setup-tour',
  imports: [],
  templateUrl: './setup-tour.component.html',
  styleUrl: './setup-tour.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupTourComponent implements OnInit, OnDestroy {
  @Output() tourCompleted = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private readonly tourService = inject(TourService);

  currentStep: TourStep | null = null;
  currentStepIndex = 0;
  totalSteps = 0;
  isActive = false;

  ngOnInit(): void {
    this.totalSteps = this.tourService.getTotalSteps();

    // Subscribe to tour state changes
    this.tourService.isActive.pipe(takeUntil(this.destroy$)).subscribe((isActive) => {
      this.isActive = isActive;
      if (!isActive) {
        this.tourCompleted.emit();
      }
    });

    this.tourService.currentStep.pipe(takeUntil(this.destroy$)).subscribe((stepIndex) => {
      this.currentStepIndex = stepIndex;
      this.currentStep = this.tourService.getCurrentStepData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tourService.endTour();
  }

  nextStep(): void {
    this.tourService.nextStep();
  }

  previousStep(): void {
    this.tourService.previousStep();
  }

  skipTour(): void {
    this.tourService.skipTour();
  }

  endTour(): void {
    this.tourService.endTour();
  }

  get canGoNext(): boolean {
    return this.currentStepIndex < this.totalSteps - 1;
  }

  get canGoPrevious(): boolean {
    return this.currentStepIndex > 0;
  }

  get progressPercentage(): number {
    return Math.round(((this.currentStepIndex + 1) / this.totalSteps) * 100);
  }
}
