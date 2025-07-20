// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import { Component, inject, ViewChild, computed, effect } from '@angular/core';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { UserStepComponent } from './components/user-step/user-step.component';
import { WizardConfigStore } from '@modules/config/application/store/wizard-config.store';

@Component({
  selector: 'app-wizard-config',
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatProgressBar,
    BreadcrumbComponent,
    UserStepComponent,
  ],
  template: `
    <div class="wizard-container">
      <!-- Breadcrumb -->
      <app-breadcrumb></app-breadcrumb>

      <!-- Progress Bar -->
      @if (isLoading()) {
        <div class="loading-overlay">
          <mat-card>
            <mat-card-content>
              <div class="loading-content">
                <mat-icon class="loading-icon">hourglass_empty</mat-icon>
                <h3>Cargando Asistente de Configuración</h3>
                <p>Inicializando el asistente...</p>
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      } @else {
        <!-- Main Content -->
        <div class="wizard-content">
          <!-- Progress Header -->
          <div class="progress-header">
            <div class="progress-info">
              <h2>Asistente de Configuración</h2>
              <p>Paso {{ currentStepIndex() + 1 }} de {{ totalStepsCount() }}</p>
            </div>
            <div class="progress-bar-container">
              <mat-progress-bar
                [value]="progressPercentage()"
                color="primary"
                [attr.aria-label]="'Progreso: ' + progressPercentage() + '%'"
              ></mat-progress-bar>
              <span class="progress-text">{{ progressPercentage() }}% completado</span>
            </div>
          </div>

          <!-- Error Display -->
          @if (hasError()) {
            <div class="error-banner" role="alert">
              <mat-icon>error</mat-icon>
              <span>{{ error() }}</span>
              <button mat-icon-button (click)="clearError()" aria-label="Cerrar error">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }

          <!-- Stepper -->
          <mat-stepper
            #stepper
            [linear]="isLinear()"
            [selectedIndex]="currentStepIndex()"
            (selectionChange)="onStepChange($event.selectedIndex)"
            aria-label="Configuration Wizard"
            role="tablist"
          >
            @for (step of steps(); track step.id; let stepIndex = $index) {
              <mat-step
                [aria-label]="step.name"
                role="tab"
                [completed]="step.isCompleted"
                [editable]="step.isEnabled"
                [state]="getStepState(step)"
              >
                <ng-template matStepLabel>
                  <div class="step-label">
                    <span class="step-number">{{ step.code }}</span>
                    <span class="step-title">{{ step.name }}</span>
                    @if (step.isCompleted) {
                      <mat-icon class="step-completed" aria-label="Step completed">
                        check_circle
                      </mat-icon>
                    }
                    @if (!step.isEnabled) {
                      <mat-icon class="step-disabled" aria-label="Step disabled">
                        lock
                      </mat-icon>
                    }
                  </div>
                </ng-template>

                <!-- Step Content -->
                <div class="step-content">
                  <!-- Welcome Step -->
                  @if (step.code === 'I') {
                    <div class="welcome-step">
                      <mat-card>
                        <mat-card-content>
                          <div class="welcome-content">
                            <mat-icon class="welcome-icon">waving_hand</mat-icon>
                            <h2>¡Bienvenido al Asistente de Configuración!</h2>
                            <p>
                              Este asistente le guiará a través del proceso de configuración inicial
                              de su sistema. Complete cada paso para configurar correctamente su empresa.
                            </p>
                            <div class="welcome-features">
                              <div class="feature">
                                <mat-icon>person</mat-icon>
                                <span>Configuración de Usuario</span>
                              </div>
                              <div class="feature">
                                <mat-icon>business</mat-icon>
                                <span>Configuración de Establecimiento</span>
                              </div>
                              <div class="feature">
                                <mat-icon>description</mat-icon>
                                <span>Configuración de Documentos</span>
                              </div>
                              <div class="feature">
                                <mat-icon>security</mat-icon>
                                <span>Firma Electrónica</span>
                              </div>
                            </div>
                            <div class="welcome-actions">
                              <button
                                mat-raised-button
                                color="primary"
                                (click)="moveToNextStep()"
                                [disabled]="!canProceedToNextStep()"
                              >
                                Comenzar Configuración
                                <mat-icon>arrow_forward</mat-icon>
                              </button>
                            </div>
                          </div>
                        </mat-card-content>
                      </mat-card>
                    </div>
                  }

                  <!-- User Step -->
                  @if (step.code === 'II') {
                    <app-user-step></app-user-step>
                  }

                  <!-- Establishment Step -->
                  @if (step.code === 'III') {
                    <div class="establishment-step">
                      <mat-card>
                        <mat-card-content>
                          <div class="step-header">
                            <h3>Configuración del Establecimiento</h3>
                            <p>Configure la información de su establecimiento comercial.</p>
                          </div>
                          <!-- TODO: Add EstablishmentStepComponent -->
                          <div class="placeholder-content">
                            <mat-icon>business</mat-icon>
                            <p>Componente de establecimiento en desarrollo</p>
                          </div>
                        </mat-card-content>
                      </mat-card>
                    </div>
                  }

                  <!-- Contribuyente Step -->
                  @if (step.code === 'IV') {
                    <div class="contribuyente-step">
                      <mat-card>
                        <mat-card-content>
                          <div class="step-header">
                            <h3>Configuración de Contribuyente</h3>
                            <p>Configure el tipo de contribuyente y actividad económica.</p>
                          </div>
                          <!-- TODO: Add ContribuyenteStepComponent -->
                          <div class="placeholder-content">
                            <mat-icon>account_balance</mat-icon>
                            <p>Componente de contribuyente en desarrollo</p>
                          </div>
                        </mat-card-content>
                      </mat-card>
                    </div>
                  }

                  <!-- Documents Step -->
                  @if (step.code === 'V') {
                    <div class="documents-step">
                      <mat-card>
                        <mat-card-content>
                          <div class="step-header">
                            <h3>Configuración de Documentos</h3>
                            <p>Configure las secuencias iniciales para sus documentos electrónicos.</p>
                          </div>
                          <!-- TODO: Add DocumentsStepComponent -->
                          <div class="placeholder-content">
                            <mat-icon>description</mat-icon>
                            <p>Componente de documentos en desarrollo</p>
                          </div>
                        </mat-card-content>
                      </mat-card>
                    </div>
                  }

                  <!-- Certificate Step -->
                  @if (step.code === 'VI') {
                    <div class="certificate-step">
                      <mat-card>
                        <mat-card-content>
                          <div class="step-header">
                            <h3>Firma Electrónica</h3>
                            <p>Suba su archivo de firma electrónica para poder emitir documentos electrónicos.</p>
                          </div>
                          <!-- TODO: Add CertificateStepComponent -->
                          <div class="placeholder-content">
                            <mat-icon>security</mat-icon>
                            <p>Componente de certificado en desarrollo</p>
                          </div>
                        </mat-card-content>
                      </mat-card>
                    </div>
                  }
                </div>

                <!-- Step Actions -->
                <div class="step-actions">
                  @if (canGoToPreviousStep()) {
                    <button
                      mat-button
                      (click)="moveToPreviousStep()"
                      [disabled]="isAnySaving()"
                    >
                      <mat-icon>arrow_back</mat-icon>
                      Anterior
                    </button>
                  }

                  <div class="step-actions-right">
                    @if (step.code !== 'I' && allowSkip()) {
                      <button
                        mat-button
                        (click)="skipStep()"
                        [disabled]="isAnySaving()"
                      >
                        Omitir
                      </button>
                    }

                    @if (stepIndex < steps().length - 1) {
                      <button
                        mat-raised-button
                        color="primary"
                        (click)="moveToNextStep()"
                        [disabled]="!canProceedToNextStep() || isAnySaving()"
                      >
                        Siguiente
                        <mat-icon>arrow_forward</mat-icon>
                      </button>
                    } @else {
                      <button
                        mat-raised-button
                        color="accent"
                        (click)="finishWizard()"
                        [disabled]="hasIncompleteRequiredSteps() || isAnySaving()"
                      >
                        Finalizar
                        <mat-icon>check</mat-icon>
                      </button>
                    }
                  </div>
                </div>
              </mat-step>
            }
          </mat-stepper>
        </div>
      }
    </div>
  `,
  styles: [`
    .wizard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    .loading-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loading-content {
      text-align: center;
      padding: 2rem;
    }

    .loading-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .wizard-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .progress-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .progress-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .progress-info p {
      margin: 0;
      opacity: 0.9;
    }

    .progress-bar-container {
      flex: 1;
      max-width: 400px;
    }

    .progress-text {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .error-banner {
      background: #ffebee;
      color: #d32f2f;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid #ffcdd2;
    }

    .error-banner mat-icon {
      flex-shrink: 0;
    }

    .error-banner span {
      flex: 1;
    }

    .step-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .step-number {
      background: #1976d2;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .step-title {
      font-weight: 500;
    }

    .step-completed {
      color: #4caf50;
      font-size: 1.2rem;
    }

    .step-disabled {
      color: #9e9e9e;
      font-size: 1.2rem;
    }

    .step-content {
      padding: 2rem;
    }

    .welcome-content {
      text-align: center;
      padding: 2rem 0;
    }

    .welcome-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .welcome-content h2 {
      margin: 0 0 1rem 0;
      color: #1976d2;
      font-size: 2rem;
    }

    .welcome-content p {
      margin: 0 0 2rem 0;
      color: #666;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .welcome-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .feature mat-icon {
      color: #1976d2;
    }

    .welcome-actions {
      margin-top: 2rem;
    }

    .step-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .step-header h3 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
      font-size: 1.5rem;
    }

    .step-header p {
      margin: 0;
      color: #666;
    }

    .placeholder-content {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .placeholder-content mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
    }

    .step-actions-right {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .progress-header {
        flex-direction: column;
        text-align: center;
      }

      .progress-bar-container {
        max-width: 100%;
      }

      .step-actions {
        flex-direction: column;
        gap: 1rem;
      }

      .step-actions-right {
        width: 100%;
        justify-content: center;
      }

      .welcome-features {
        grid-template-columns: 1fr;
      }
    }
  `],
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

  getStepState(step: any): string {
    if (step.isCompleted) return 'done';
    if (!step.isEnabled) return 'disabled';
    return 'default';
  }
}
