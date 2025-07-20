import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

// Models
import { DemoStep } from '@modules/config/domain/models/wizard-config/demo-step.model';
import { DocConfig } from '@modules/config/domain/models/doc-config.model';
import { UserData } from '@modules/auth/domain/models/user-data.model';
import { Canton } from '@modules/config/domain/models/wizard-config/canton.model';
import { ActividadEconomica } from '@modules/config/domain/models/wizard-config/actividad-economica.model';
import { AgenteRetencion } from '@modules/config/domain/models/wizard-config/agente-retencion.model';
import { Contribuyente } from '@modules/config/domain/models/wizard-config/contribuyente.model';
import { AmbienteSri, ambienteSriOptions } from '@shared/models/ambiente-sri';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ApiResponse, isApiResponse } from '@core/models/api-response';

// Services
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { FirmaElectronicaService } from '@modules/config/services/firma-electronica.service';
import { CreateDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/create-doc-config.use-case';
import { GetDocConfigFormDataUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-form-data.use-case';
import { UpdateUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/update-user-customer.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

// Interfaces
interface DocConfigItem {
  idPuntoEmision: string;
  idTipoDocumento: string;
  ultimaSecuencia: number;
  descripcion?: string;
  parentId?: string;
}

interface EstabWithChildren extends GroupedEstab {
  _children: DocConfigItem[];
}

interface UserFormControls {
  nroIdentificacion: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
}

interface BodegaFormControls {
  descripcion: FormControl<string | null>;
  direccion: FormControl<string | null>;
  telefono: FormControl<string | null>;
}

interface PtoEmiFormControls {
  ptoEmi: FormControl<string | null>;
  ambiente: FormControl<string | null>;
}

interface EstabFormControls {
  canton: FormControl<string | null>;
  estab: FormControl<string | null>;
  nombreComercial: FormControl<string | null>;
  dirEstablecimiento: FormControl<string | null>;
  telefono: FormControl<string | null>;
  correo: FormControl<string | null>;
  ptosEmi: FormArray<FormGroup<PtoEmiFormControls>>;
  hasInventory: FormControl<boolean | null>;
  bodegas: FormArray<FormGroup<BodegaFormControls>>;
}

// State Interface
interface WizardConfigState {
  // Data
  cantones: Canton[];
  actividadesEconomica: ActividadEconomica[];
  agentesRetencion: AgenteRetencion[];
  contribuyentes: Contribuyente[];
  ambientes: AmbienteSri[];
  establecimientos: GroupedEstab[];
  puntosEmision: GroupedEstabPuntoEmision[];
  docs: DocConfig[];
  demoSteps: DemoStep[];
  docsConfig: EstabWithChildren[];

  // UI State
  emails: string[];
  telephones: string[];
  currentEstab: string;
  fileError: boolean;
  selectedFile: File | null;

  // Step Completion Flags
  userUpdated: boolean;
  estabRegistered: boolean;
  tipoContribuyenteRegistered: boolean;
  docsUpdated: boolean;
  certificateUpdated: boolean;

  // Loading States
  isLoadingSteps: boolean;
  isLoadingEstabData: boolean;
  isLoadingDocConfig: boolean;
  isSavingUser: boolean;
  isSavingEstab: boolean;
  isSavingDocs: boolean;
  isSavingCertificate: boolean;

  // User Data
  user: UserData | null;

  // Stepper Configuration
  isLinear: boolean;
}

const initialState: WizardConfigState = {
  // Data
  cantones: [],
  actividadesEconomica: [],
  agentesRetencion: [],
  contribuyentes: [],
  ambientes: ambienteSriOptions,
  establecimientos: [],
  puntosEmision: [],
  docs: [],
  demoSteps: [],
  docsConfig: [],

  // UI State
  emails: [],
  telephones: [],
  currentEstab: '',
  fileError: false,
  selectedFile: null,

  // Step Completion Flags
  userUpdated: false,
  estabRegistered: false,
  tipoContribuyenteRegistered: false,
  docsUpdated: false,
  certificateUpdated: false,

  // Loading States
  isLoadingSteps: false,
  isLoadingEstabData: false,
  isLoadingDocConfig: false,
  isSavingUser: false,
  isSavingEstab: false,
  isSavingDocs: false,
  isSavingCertificate: false,

  // User Data
  user: null,

  // Stepper Configuration
  isLinear: false,
};

export const WizardConfigStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    // Step Navigation Computed
    hasIncompleteSteps: computed(() =>
      store.demoSteps().some(step => !step.completed)
    ),

    currentStepIndex: computed(() =>
      store.demoSteps().findIndex(step => !step.completed)
    ),

    canProceedToNextStep: computed(() => {
      const currentStepIndex = store.demoSteps().findIndex(step => !step.completed);
      const currentStep = currentStepIndex >= 0 ? store.demoSteps()[currentStepIndex] : null;
      return currentStep?.completed ?? false;
    }),

    // Loading States Computed
    isLoading: computed(() =>
      store.isLoadingSteps() ||
      store.isLoadingEstabData() ||
      store.isLoadingDocConfig() ||
      store.isSavingUser() ||
      store.isSavingEstab() ||
      store.isSavingDocs() ||
      store.isSavingCertificate()
    ),

    // Step Completion Computed
    completedStepsCount: computed(() =>
      store.demoSteps().filter(step => step.completed).length
    ),

    totalStepsCount: computed(() => store.demoSteps().length),

    progressPercentage: computed(() => {
      const total = store.demoSteps().length;
      const completed = store.demoSteps().filter(step => step.completed).length;
      return total > 0 ? (completed / total) * 100 : 0;
    }),

    // Data Availability Computed
    hasEstabData: computed(() => store.establecimientos().length > 0),
    hasDocConfig: computed(() => store.docsConfig().length > 0),
    hasUserData: computed(() => store.user() !== null),

    // Current Step Info
    currentStep: computed(() => {
      const index = store.demoSteps().findIndex(step => !step.completed);
      return index >= 0 ? store.demoSteps()[index] : null;
    }),

    nextStep: computed(() => {
      const currentIndex = store.demoSteps().findIndex(step => !step.completed);
      const nextIndex = currentIndex + 1;
      return nextIndex < store.demoSteps().length ? store.demoSteps()[nextIndex] : null;
    }),

    previousStep: computed(() => {
      const currentIndex = store.demoSteps().findIndex(step => !step.completed);
      const prevIndex = currentIndex - 1;
      return prevIndex >= 0 ? store.demoSteps()[prevIndex] : null;
    }),
  })),

  withMethods((store, $companyDemoStepService = inject(CompanyDemoStepService), $estabService = inject(EstablishmentService), $formDataDocConfig = inject(GetDocConfigFormDataUseCase), $createDocConfigUseCase = inject(CreateDocConfigUseCase), $updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase), $firmaElectronicaService = inject(FirmaElectronicaService), $tokenUseCase = inject(TokenUseCase), $toasterService = inject(ToastrNotificationService), $fb = inject(FormBuilder)) => ({
    // Data Loading Methods
    loadCompanyDemoSteps() {
      patchState(store, { isLoadingSteps: true });

      $companyDemoStepService.get({}).pipe(
        takeUntilDestroyed(),
        catchError((error: unknown) => {
          console.error('Error loading demo steps:', error);
          $toasterService.show({
            type: 'error',
            message: 'Error al cargar los pasos del asistente'
          });
          patchState(store, { isLoadingSteps: false });
          return of(null);
        })
      ).subscribe((response) => {
        if (response?.code === '1') {
          const tempArray = JSON.parse(response.payload as string);
          const demoSteps = tempArray['companyDemoSteps'] as DemoStep[];

          patchState(store, {
            demoSteps,
            isLoadingSteps: false,
          });

          this.updateStepCompletionStatus();
          this.handleIncompleteSteps();
        } else {
          patchState(store, { isLoadingSteps: false });
        }
      });
    },

    loadEstabData() {
      patchState(store, { isLoadingEstabData: true });

      $estabService.getDataForm().pipe(
        takeUntilDestroyed(),
        catchError((error: unknown) => {
          console.error('Error loading establishment data:', error);
          $toasterService.show({
            type: 'error',
            message: 'Error al cargar datos de establecimiento'
          });
          patchState(store, { isLoadingEstabData: false });
          return of({ cantones: [], actividadesEconomica: [], agentesRetencion: [], contribuyentes: [] });
        })
      ).subscribe((response: any) => {
        const cantones = response.cantones || [];
        patchState(store, {
          cantones,
          isLoadingEstabData: false,
        });
      });
    },

    loadDocConfig() {
      patchState(store, { isLoadingDocConfig: true });

      $formDataDocConfig.execute().pipe(
        takeUntilDestroyed(),
        catchError((error: unknown) => {
          console.error('Error loading doc config:', error);
          $toasterService.show({
            type: 'error',
            message: 'Error al cargar configuración de documentos'
          });
          patchState(store, { isLoadingDocConfig: false });
          return of(null);
        })
      ).subscribe((response) => {
        if (response) {
          const establecimientos = response.establecimientos;
          const currentEstab = establecimientos[0]?.nombreComercial || '';

          const combinedData = establecimientos.map((pto) => ({
            ...pto,
            _children: (response.tiposDoc as DocConfigItem[]).map((doc) => ({
              ...doc,
              parentId: String(pto.puntosEmision[0]?.idPuntoEmision || ''),
            })),
          }));

          patchState(store, {
            establecimientos,
            currentEstab,
            docsConfig: combinedData,
            isLoadingDocConfig: false,
          });
        } else {
          patchState(store, { isLoadingDocConfig: false });
        }
      });
    },

    // User Management Methods
    initializeUserData() {
      const decodedToken = $tokenUseCase.getUserData();
      if (decodedToken) {
        patchState(store, { user: decodedToken });
      }
    },

    // Step Management Methods
    updateStepCompletionStatus() {
      const updatedSteps = store.demoSteps().map(step => ({
        ...step,
        completed: this.getStepCompletionStatus(step.code),
      }));

      patchState(store, { demoSteps: updatedSteps });
    },

    getStepCompletionStatus(stepCode: string): boolean {
      switch (stepCode) {
        case 'I': return true; // Welcome step is always completed
        case 'II': return store.userUpdated();
        case 'III': return store.estabRegistered();
        case 'IV': return store.tipoContribuyenteRegistered();
        case 'V': return store.docsUpdated();
        case 'VI': return store.certificateUpdated();
        case 'VII': return true; // Completion step is always completed
        default: return false;
      }
    },

    handleIncompleteSteps() {
      const incompleteSteps = store.demoSteps().filter(step => !step.completed);

      if (incompleteSteps.length > 0) {
        const firstIncompleteStep = incompleteSteps[0];
        this.loadStepData(firstIncompleteStep.code);
      }
    },

    loadStepData(stepCode: string) {
      switch (stepCode) {
        case 'II':
          // User step data is already loaded
          break;
        case 'III':
          this.loadEstabData();
          break;
        case 'IV':
          // Contribuyente data loading
          break;
        case 'V':
          this.loadDocConfig();
          break;
        case 'VI':
          // Certificate step data
          break;
      }
    },

    // Step Completion Methods
    markUserStepCompleted() {
      patchState(store, { userUpdated: true });
      this.updateStepCompletionStatus();
    },

    markEstabStepCompleted() {
      patchState(store, { estabRegistered: true });
      this.updateStepCompletionStatus();
    },

    markContribuyenteStepCompleted() {
      patchState(store, { tipoContribuyenteRegistered: true });
      this.updateStepCompletionStatus();
    },

    markDocsStepCompleted() {
      patchState(store, { docsUpdated: true });
      this.updateStepCompletionStatus();
    },

    markCertificateStepCompleted() {
      patchState(store, { certificateUpdated: true });
      this.updateStepCompletionStatus();
    },

    // UI State Methods
    addEmail(email: string) {
      const currentEmails = store.emails();
      if (!currentEmails.includes(email)) {
        patchState(store, { emails: [...currentEmails, email] });
      }
    },

    removeEmail(email: string) {
      const currentEmails = store.emails();
      patchState(store, {
        emails: currentEmails.filter(e => e !== email)
      });
    },

    addTelephone(telephone: string) {
      const currentTelephones = store.telephones();
      if (!currentTelephones.includes(telephone)) {
        patchState(store, { telephones: [...currentTelephones, telephone] });
      }
    },

    removeTelephone(telephone: string) {
      const currentTelephones = store.telephones();
      patchState(store, {
        telephones: currentTelephones.filter(t => t !== telephone)
      });
    },

    setFileError(error: boolean) {
      patchState(store, { fileError: error });
    },

    setSelectedFile(file: File | null) {
      patchState(store, { selectedFile: file });
    },

    setCurrentEstab(estab: string) {
      patchState(store, { currentEstab: estab });
    },

    // Form Factory Methods
    createUserForm(): FormGroup<UserFormControls> {
      return $fb.group<UserFormControls>({
        nroIdentificacion: $fb.control(''),
        firstName: $fb.control('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        lastName: $fb.control('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      });
    },

    createEstabForm(): FormGroup<EstabFormControls> {
      return $fb.group<EstabFormControls>({
        canton: $fb.control(''),
        estab: $fb.control('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ]),
        nombreComercial: $fb.control('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300)
        ]),
        dirEstablecimiento: $fb.control('', [
          Validators.required,
          Validators.maxLength(300)
        ]),
        telefono: $fb.control(''),
        correo: $fb.control(''),
        ptosEmi: $fb.array<FormGroup<PtoEmiFormControls>>([]),
        hasInventory: $fb.control(false),
        bodegas: $fb.array<FormGroup<BodegaFormControls>>([]),
      });
    },

    createTipoContribuyenteForm(): FormGroup {
      return $fb.group({
        actividad: ['', Validators.required],
        agenteRetencion: '',
        contribuyente: ['', Validators.required],
        contribuyenteEspecial: [''],
        obligadoContabilidad: [
          '',
          [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
        ],
      });
    },

    createCertificateForm(): FormGroup {
      return $fb.group({
        contrasenia: ['', Validators.required],
        fechaCaducidad: ['', Validators.required],
        fileSign: [null, Validators.required],
      });
    },

    // Form Array Factory Methods
    createBodegaForm(): FormGroup<BodegaFormControls> {
      return $fb.group<BodegaFormControls>({
        descripcion: $fb.control('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300),
        ]),
        direccion: $fb.control('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300),
        ]),
        telefono: $fb.control(''),
      });
    },

    createPtoEmiForm(): FormGroup<PtoEmiFormControls> {
      return $fb.group<PtoEmiFormControls>({
        ptoEmi: $fb.control('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ]),
        ambiente: $fb.control('', Validators.required),
      });
    },

    // Reset Methods
    resetWizard() {
      patchState(store, {
        ...initialState,
        ambientes: ambienteSriOptions, // Keep default ambientes
      });
    },

    resetStepCompletion() {
      patchState(store, {
        userUpdated: false,
        estabRegistered: false,
        tipoContribuyenteRegistered: false,
        docsUpdated: false,
        certificateUpdated: false,
      });
    },
  })),

  withHooks({
    onInit(store) {
      // Initialize user data when store is created
      store.initializeUserData();
    },
  })
);
