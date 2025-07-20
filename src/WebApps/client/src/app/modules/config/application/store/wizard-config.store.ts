import { computed, inject, signal, DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, catchError, of } from 'rxjs';

// Domain Models
import { WizardConfiguration } from '@modules/config/domain/models/wizard-config/wizard-configuration.model';
import { WizardStep } from '@modules/config/domain/models/wizard-config/wizard-step.model';
import { UserData } from '@modules/config/domain/models/wizard-config/value-objects/user-data.vo';
import { EstablishmentData } from '@modules/config/domain/models/wizard-config/value-objects/establishment-data.vo';
import { Contribuyente } from '@modules/config/domain/models/wizard-config/contribuyente.model';
import { DocConfig } from '@modules/config/domain/models/doc-config.model';
import { ElectronicSignatureParam } from '@modules/config/domain/models/electronic-signature.model';

// Use Cases
import { GetWizardConfigurationUseCase } from '../use-cases/wizard-config/get-wizard-configuration.use-case';
import { SaveUserDataUseCase } from '../use-cases/wizard-config/save-user-data.use-case';
import { SaveEstablishmentDataUseCase } from '../use-cases/wizard-config/save-establishment-data.use-case';
import { SaveContribuyenteDataUseCase } from '../use-cases/wizard-config/save-contribuyente-data.use-case';
import { CreateDocConfigUseCase } from '../use-cases/doc-config/create-doc-config.use-case';
import { CreateElectronicSignatureUseCase } from '../use-cases/electronic-signature/create-electronic-signature.use-case';

// Services
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

// State Interface
interface WizardConfigState {
  // Core Data
  configuration: WizardConfiguration | null;
  userData: UserData | null;
  establishmentData: EstablishmentData | null;

  // Reference Data
  cantones: any[];
  actividadesEconomica: any[];
  agentesRetencion: any[];
  contribuyentes: any[];
  ambientes: any[];

  // UI State
  currentStepIndex: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Step-specific loading states
  isSavingUser: boolean;
  isSavingEstablishment: boolean;
  isSavingContribuyente: boolean;
  isSavingDocuments: boolean;
  isSavingCertificate: boolean;
}

const initialState: WizardConfigState = {
  // Core Data
  configuration: null,
  userData: null,
  establishmentData: null,

  // Reference Data
  cantones: [],
  actividadesEconomica: [],
  agentesRetencion: [],
  contribuyentes: [],
  ambientes: [],

  // UI State
  currentStepIndex: 0,
  isLoading: false,
  isSaving: false,
  error: null,

  // Step-specific loading states
  isSavingUser: false,
  isSavingEstablishment: false,
  isSavingContribuyente: false,
  isSavingDocuments: false,
  isSavingCertificate: false,
};

@Injectable({
  providedIn: 'root'
})
export class WizardConfigStore {
  // ============================================================================
  // SIGNAL STATE
  // ============================================================================

  // Core Data Signals
  readonly configuration = signal<WizardConfiguration | null>(initialState.configuration);
  readonly userData = signal<UserData | null>(initialState.userData);
  readonly establishmentData = signal<EstablishmentData | null>(initialState.establishmentData);

  // Reference Data Signals
  readonly cantones = signal<any[]>(initialState.cantones);
  readonly actividadesEconomica = signal<any[]>(initialState.actividadesEconomica);
  readonly agentesRetencion = signal<any[]>(initialState.agentesRetencion);
  readonly contribuyentes = signal<any[]>(initialState.contribuyentes);
  readonly ambientes = signal<any[]>(initialState.ambientes);

  // UI State Signals
  readonly currentStepIndex = signal<number>(initialState.currentStepIndex);
  readonly isLoading = signal<boolean>(initialState.isLoading);
  readonly isSaving = signal<boolean>(initialState.isSaving);
  readonly error = signal<string | null>(initialState.error);

  // Step-specific loading states
  readonly isSavingUser = signal<boolean>(initialState.isSavingUser);
  readonly isSavingEstablishment = signal<boolean>(initialState.isSavingEstablishment);
  readonly isSavingContribuyente = signal<boolean>(initialState.isSavingContribuyente);
  readonly isSavingDocuments = signal<boolean>(initialState.isSavingDocuments);
  readonly isSavingCertificate = signal<boolean>(initialState.isSavingCertificate);

  // ============================================================================
  // COMPUTED SIGNALS
  // ============================================================================

  readonly steps = computed(() => this.configuration()?.steps || []);
  readonly currentStep = computed(() => this.configuration()?.currentStep || null);
  readonly nextStep = computed(() => this.configuration()?.nextStep || null);
  readonly previousStep = computed(() => this.configuration()?.previousStep || null);

  readonly completedSteps = computed(() => this.configuration()?.completedSteps || []);
  readonly completedStepsCount = computed(() => this.configuration()?.completedStepsCount || 0);
  readonly totalStepsCount = computed(() => this.configuration()?.totalStepsCount || 0);
  readonly progressPercentage = computed(() => this.configuration()?.progressPercentage || 0);

  readonly canProceedToNextStep = computed(() => this.configuration()?.canProceedToNextStep || false);
  readonly canGoToPreviousStep = computed(() => this.configuration()?.canGoToPreviousStep || false);
  readonly hasIncompleteRequiredSteps = computed(() => this.configuration()?.hasIncompleteRequiredSteps || false);

  readonly isLinear = computed(() => this.configuration()?.isLinear || true);
  readonly allowSkip = computed(() => this.configuration()?.allowSkip || false);
  readonly autoSave = computed(() => this.configuration()?.autoSave || true);

  readonly hasUserData = computed(() => this.userData() !== null);
  readonly hasEstablishmentData = computed(() => this.establishmentData() !== null);

  readonly hasError = computed(() => this.error() !== null);
  readonly isAnySaving = computed(() =>
    this.isSavingUser() ||
    this.isSavingEstablishment() ||
    this.isSavingContribuyente() ||
    this.isSavingDocuments() ||
    this.isSavingCertificate()
  );

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  private readonly _getWizardConfigurationUseCase = inject(GetWizardConfigurationUseCase);
  private readonly _saveUserDataUseCase = inject(SaveUserDataUseCase);
  private readonly _saveEstablishmentDataUseCase = inject(SaveEstablishmentDataUseCase);
  private readonly _saveContribuyenteDataUseCase = inject(SaveContribuyenteDataUseCase);
  private readonly _createDocConfigUseCase = inject(CreateDocConfigUseCase);
  private readonly _createElectronicSignatureUseCase = inject(CreateElectronicSignatureUseCase);
  private readonly _toasterService = inject(ToastrNotificationService);
  private readonly _destroyRef = inject(DestroyRef);

  // ============================================================================
  // CONSTRUCTOR
  // ============================================================================

  constructor() {
    this.initializeStore();
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  loadWizardConfiguration(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._getWizardConfigurationUseCase.execute().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (response) => {
        this.configuration.set(response.configuration);
        this.currentStepIndex.set(response.configuration.currentStepIndex);
        this.isLoading.set(false);

        if (!response.isLoaded) {
          this.error.set(response.error || 'Error loading configuration');
        }
      },
      error: (error) => {
        this.error.set(error.message || 'Error loading configuration');
        this.isLoading.set(false);
        this._toasterService.error({ message: 'Error loading wizard configuration' });
      }
    });
  }

  moveToNextStep(): void {
    const config = this.configuration();
    if (!config || !config.canProceedToNextStep) {
      this._toasterService.warning({ message: 'Cannot proceed to next step' });
      return;
    }

    try {
      const updatedConfig = config.moveToNextStep();
      this.configuration.set(updatedConfig);
      this.currentStepIndex.set(updatedConfig.currentStepIndex);
        } catch (error) {
      this._toasterService.error({ message: 'Error moving to next step' });
    }
  }

  moveToPreviousStep(): void {
    const config = this.configuration();
    if (!config || !config.canGoToPreviousStep) {
      this._toasterService.warning({ message: 'Cannot go to previous step' });
      return;
    }

    try {
      const updatedConfig = config.moveToPreviousStep();
      this.configuration.set(updatedConfig);
      this.currentStepIndex.set(updatedConfig.currentStepIndex);
    } catch (error) {
      this._toasterService.error({ message: 'Error moving to previous step' });
    }
  }

  moveToStep(stepIndex: number): void {
    const config = this.configuration();
    if (!config) return;

    try {
      const updatedConfig = config.moveToStep(stepIndex);
      this.configuration.set(updatedConfig);
      this.currentStepIndex.set(updatedConfig.currentStepIndex);
    } catch (error) {
      this._toasterService.error({ message: 'Error moving to step' });
    }
  }

  completeCurrentStep(): void {
    const config = this.configuration();
    if (!config) return;

    try {
      const updatedConfig = config.completeCurrentStep();
      this.configuration.set(updatedConfig);
      this._toasterService.success({ message: 'Step completed successfully' });
    } catch (error) {
      this._toasterService.error({ message: 'Error completing step' });
    }
  }

  saveUserData(userData: UserData): void {
    this.isSavingUser.set(true);
    this.error.set(null);

    this._saveUserDataUseCase.execute({ userData }).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (response) => {
        this.userData.set(response.userData);
        this.isSavingUser.set(false);
        this.completeCurrentStep();
        this._toasterService.success({ message: 'User data saved successfully' });
      },
      error: (error) => {
        this.error.set(error.message || 'Error saving user data');
        this.isSavingUser.set(false);
        this._toasterService.error({ message: 'Error saving user data' });
      }
    });
  }

  saveEstablishmentData(establishmentData: EstablishmentData): void {
    this.isSavingEstablishment.set(true);
    this.error.set(null);

    this._saveEstablishmentDataUseCase.execute({ establishmentData }).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (response) => {
        this.establishmentData.set(response.establishmentData);
        this.isSavingEstablishment.set(false);
        this.completeCurrentStep();
        this._toasterService.success({ message: 'Establishment data saved successfully' });
      },
      error: (error) => {
        this.error.set(error.message || 'Error saving establishment data');
        this.isSavingEstablishment.set(false);
        this._toasterService.error({ message: 'Error saving establishment data' });
      }
    });
  }

  saveContribuyenteData(contribuyente: Contribuyente): void {
    this.isSavingContribuyente.set(true);
    this.error.set(null);
    this._saveContribuyenteDataUseCase.execute({ contribuyente }).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (response) => {
        // Optionally update state with response
        this.isSavingContribuyente.set(false);
        this.completeCurrentStep();
        this._toasterService.success({ message: 'Contribuyente guardado exitosamente' });
      },
      error: (error) => {
        this.error.set(error.message || 'Error guardando contribuyente');
        this.isSavingContribuyente.set(false);
        this._toasterService.error({ message: 'Error guardando contribuyente' });
      }
    });
  }

  saveDocumentsConfig(docConfig: DocConfig): void {
    this.isSavingDocuments.set(true);
    this.error.set(null);
    this._createDocConfigUseCase.execute(docConfig).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (response) => {
        // Optionally update state with response
        this.isSavingDocuments.set(false);
        this.completeCurrentStep();
        this._toasterService.success({ message: 'Documentos guardados exitosamente' });
      },
      error: (error) => {
        this.error.set(error.message || 'Error guardando documentos');
        this.isSavingDocuments.set(false);
        this._toasterService.error({ message: 'Error guardando documentos' });
      }
    });
  }

  saveElectronicSignature(signatureData: ElectronicSignatureParam): void {
    this.isSavingCertificate.set(true);
    this.error.set(null);
    this._createElectronicSignatureUseCase.execute(signatureData).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (response) => {
        // Optionally update state with response
        this.isSavingCertificate.set(false);
        this.completeCurrentStep();
        this._toasterService.success({ message: 'Firma electrónica guardada exitosamente' });
      },
      error: (error) => {
        this.error.set(error.message || 'Error guardando firma electrónica');
        this.isSavingCertificate.set(false);
        this._toasterService.error({ message: 'Error guardando firma electrónica' });
      }
    });
  }

  updateReferenceData(data: {
    cantones?: any[];
    actividadesEconomica?: any[];
    agentesRetencion?: any[];
    contribuyentes?: any[];
    ambientes?: any[];
  }): void {
    if (data.cantones) this.cantones.set(data.cantones);
    if (data.actividadesEconomica) this.actividadesEconomica.set(data.actividadesEconomica);
    if (data.agentesRetencion) this.agentesRetencion.set(data.agentesRetencion);
    if (data.contribuyentes) this.contribuyentes.set(data.contribuyentes);
    if (data.ambientes) this.ambientes.set(data.ambientes);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  clearError(): void {
    this.error.set(null);
  }

  resetStore(): void {
    this.configuration.set(null);
    this.userData.set(null);
    this.establishmentData.set(null);
    this.currentStepIndex.set(0);
    this.isLoading.set(false);
    this.isSaving.set(false);
    this.error.set(null);
    this.isSavingUser.set(false);
    this.isSavingEstablishment.set(false);
    this.isSavingContribuyente.set(false);
    this.isSavingDocuments.set(false);
    this.isSavingCertificate.set(false);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private initializeStore(): void {
    // Auto-load configuration on store initialization
    this.loadWizardConfiguration();
  }
}
