import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';

@Injectable({
  providedIn: 'root',
})
export class ShepherdTourService {
  private tour: any = null;

  constructor() {
    this.initializeTour();
  }

  private initializeTour(): void {
    this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'setup-tour-step',
        scrollTo: { behavior: 'smooth', block: 'center' },
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 12,
        canClickTarget: false,
      },
    });

    this.setupSteps();
  }

  private setupSteps(): void {
    if (!this.tour) return;

    const tour = this.tour as any;

    // Step 1: Welcome and Progress
    tour.addStep({
      title: '¡Bienvenido a tu configuración inicial!',
      text: `
        <p>Te guiaremos paso a paso para configurar tu empresa. Puedes ver tu progreso aquí.</p>
        <div class="tour-features">
          <div class="feature-item">
            <i class="material-icons">trending_up</i>
            <span>Seguimiento del progreso</span>
          </div>
          <div class="feature-item">
            <i class="material-icons">schedule</i>
            <span>Tiempo estimado por paso</span>
          </div>
        </div>
      `,
      attachTo: {
        element: '[data-tour="progress"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Siguiente',
          action: () => tour.next(),
          classes: 'btn btn-primary',
        },
      ],
    });

    // Step 2: Mandatory Steps
    tour.addStep({
      title: 'Pasos Obligatorios',
      text: `
        <p>Estos pasos son necesarios para el funcionamiento básico del sistema.</p>
        <div class="tour-highlights">
          <div class="highlight-item">
            <i class="material-icons">priority_high</i>
            <span>Requeridos para continuar</span>
          </div>
          <div class="highlight-item">
            <i class="material-icons">security</i>
            <span>Configuración esencial</span>
          </div>
        </div>
      `,
      attachTo: {
        element: '[data-tour="mandatory"]',
        on: 'right',
      },
      buttons: [
        {
          text: 'Anterior',
          action: () => tour.back(),
          classes: 'btn btn-outline-secondary',
        },
        {
          text: 'Siguiente',
          action: () => tour.next(),
          classes: 'btn btn-primary',
        },
      ],
    });

    // Step 3: Optional Steps
    tour.addStep({
      title: 'Pasos Opcionales',
      text: `
        <p>Recomendados para una mejor experiencia, pero puedes configurarlos más tarde.</p>
        <div class="tour-highlights">
          <div class="highlight-item">
            <i class="material-icons">star</i>
            <span>Mejoran la experiencia</span>
          </div>
          <div class="highlight-item">
            <i class="material-icons">schedule_send</i>
            <span>Configurables después</span>
          </div>
        </div>
      `,
      attachTo: {
        element: '[data-tour="optional"]',
        on: 'right',
      },
      buttons: [
        {
          text: 'Anterior',
          action: () => tour.back(),
          classes: 'btn btn-outline-secondary',
        },
        {
          text: 'Siguiente',
          action: () => tour.next(),
          classes: 'btn btn-primary',
        },
      ],
    });

    // Step 4: Individual Step Card
    tour.addStep({
      title: 'Tarjetas de Pasos',
      text: `
        <p>Cada paso muestra información detallada y su estado actual.</p>
        <div class="tour-highlights">
          <div class="highlight-item">
            <i class="material-icons">info</i>
            <span>Información detallada</span>
          </div>
          <div class="highlight-item">
            <i class="material-icons">check_circle</i>
            <span>Estado del progreso</span>
          </div>
          <div class="highlight-item">
            <i class="material-icons">schedule</i>
            <span>Tiempo estimado</span>
          </div>
        </div>
      `,
      attachTo: {
        element: '.step-card:first-child',
        on: 'left',
      },
      buttons: [
        {
          text: 'Anterior',
          action: () => tour.back(),
          classes: 'btn btn-outline-secondary',
        },
        {
          text: 'Finalizar',
          action: () => tour.complete(),
          classes: 'btn btn-success',
        },
      ],
    });
  }

  startTour(): void {
    if (this.tour) {
      (this.tour as any).start();
    }
  }

  endTour(): void {
    if (this.tour) {
      (this.tour as any).complete();
    }
  }

  isActive(): boolean {
    return this.tour ? (this.tour as any).isActive() : false;
  }
}
