import { TOUR_STEPS } from '@modules/config/data/models/configuration.model';
import { TourStep } from '../data/models/configuration.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private currentTourStep$ = new BehaviorSubject<number>(0);
  private isTourActive$ = new BehaviorSubject<boolean>(false);
  private tourSteps: TourStep[] = TOUR_STEPS;

  get currentStep() {
    return this.currentTourStep$.asObservable();
  }

  get isActive() {
    return this.isTourActive$.asObservable();
  }

  startTour(): void {
    this.currentTourStep$.next(0);
    this.isTourActive$.next(true);
    this.showCurrentStep();
  }

  nextStep(): void {
    const currentStep = this.currentTourStep$.value;
    if (currentStep < this.tourSteps.length - 1) {
      this.currentTourStep$.next(currentStep + 1);
      this.showCurrentStep();
    } else {
      this.endTour();
    }
  }

  previousStep(): void {
    const currentStep = this.currentTourStep$.value;
    if (currentStep > 0) {
      this.currentTourStep$.next(currentStep - 1);
      this.showCurrentStep();
    }
  }

  skipTour(): void {
    this.endTour();
  }

  endTour(): void {
    this.isTourActive$.next(false);
    this.currentTourStep$.next(0);
    this.removeHighlights();
  }

  getCurrentStepData(): TourStep | null {
    const currentIndex = this.currentTourStep$.value;
    return this.tourSteps[currentIndex] || null;
  }

  getTotalSteps(): number {
    return this.tourSteps.length;
  }

  private showCurrentStep(): void {
    const step = this.getCurrentStepData();
    if (step) {
      this.removeHighlights();
      this.highlightElement(step.element);
      this.scrollToElement(step.element);
    }
  }

  private highlightElement(selector: string): void {
    const element = document.querySelector(selector)!;
    if (element) {
      element.classList.add('tour-highlight');

      // Add spotlight effect
      const spotlight = document.createElement('div');
      spotlight.className = 'tour-spotlight';
      spotlight.style.position = 'fixed';
      spotlight.style.top = '0';
      spotlight.style.left = '0';
      spotlight.style.width = '100%';
      spotlight.style.height = '100%';
      spotlight.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      spotlight.style.zIndex = '9998';
      spotlight.style.pointerEvents = 'none';

      document.body.appendChild(spotlight);

      // Create cutout for highlighted element
      const rect = element.getBoundingClientRect();
      const cutout = document.createElement('div');
      cutout.className = 'tour-cutout';
      cutout.style.position = 'fixed';
      cutout.style.top = `${rect.top - 10}px`;
      cutout.style.left = `${rect.left - 10}px`;
      cutout.style.width = `${rect.width + 20}px`;
      cutout.style.height = `${rect.height + 20}px`;
      cutout.style.backgroundColor = 'transparent';
      cutout.style.border = '3px solid #007bff';
      cutout.style.borderRadius = '8px';
      cutout.style.zIndex = '9999';
      cutout.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.5)';
      cutout.style.pointerEvents = 'none';

      document.body.appendChild(cutout);
    }
  }

  private removeHighlights(): void {
    // Remove previous highlights
    document.querySelectorAll('.tour-highlight').forEach((el) => {
      el.classList.remove('tour-highlight');
    });

    // Remove spotlight and cutout
    document.querySelectorAll('.tour-spotlight, .tour-cutout').forEach((el) => {
      el.remove();
    });
  }

  private scrollToElement(selector: string): void {
    const element = document.querySelector(selector)!;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }
}
