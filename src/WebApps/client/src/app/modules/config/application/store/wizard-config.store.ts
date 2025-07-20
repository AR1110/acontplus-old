import { computed, inject, signal, DestroyRef, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class WizardConfigStore {
  // ============================================================================
  // SIGNAL STATE
  // ============================================================================

  // Data Signals
  readonly cantones = signal<Canton[]>(initialState.cantones);
  readonly actividadesEconomica = signal<ActividadEconomica[]>(initialState.actividadesEconomica);
  readonly agentesRetencion = signal<AgenteRetencion[]>(initialState.agentesRetencion);
  readonly contribuyentes = signal<Contribuyente[]>(initialState.contribuyentes);
  readonly ambientes = signal<AmbienteSri[]>(initialState.ambientes);
  readonly establecimientos = signal<GroupedEstab[]>(initialState.establecimientos);
  readonly puntosEmision = signal<GroupedEstabPuntoEmision[]>(initialState.puntosEmision);
  readonly docs = signal<DocConfig[]>(initialState.docs);
  readonly demoSteps = signal<DemoStep[]>(initialState.demoSteps);
  readonly docsConfig = signal<EstabWithChildren[]>(initialState.docsConfig);

  // UI State Signals
  readonly emails = signal<string[]>(initialState.emails);
  readonly telephones = signal<string[]>(initialState.telephones);
  readonly currentEstab = signal<string>(initialState.currentEstab);
  readonly fileError = signal<boolean>(initialState.fileError);
  readonly selectedFile = signal<File | null>(initialState.selectedFile);

  // Step Completion Flags
  readonly userUpdated = signal<boolean>(initialState.userUpdated);
  readonly estabRegistered = signal<boolean>(initialState.estabRegistered);
  readonly tipoContribuyenteRegistered = signal<boolean>(initialState.tipoContribuyenteRegistered);
  readonly docsUpdated = signal<boolean>(initialState.docsUpdated);
  readonly certificateUpdated = signal<boolean>(initialState.certificateUpdated);

  // Loading States
  readonly isLoadingSteps = signal<boolean>(initialState.isLoadingSteps);
  readonly isLoadingEstabData = signal<boolean>(initialState.isLoadingEstabData);
  readonly isLoadingDocConfig = signal<boolean>(initialState.isLoadingDocConfig);
  readonly isSavingUser = signal<boolean>(initialState.isSavingUser);
  readonly isSavingEstab = signal<boolean>(initialState.isSavingEstab);
  readonly isSavingDocs = signal<boolean>(initialState.isSavingDocs);
  readonly isSavingCertificate = signal<boolean>(initialState.isSavingCertificate);

  // User Data
  readonly user = signal<UserData | null>(initialState.user);

  // Stepper Configuration
  readonly isLinear = signal<boolean>(initialState.isLinear);

  // ============================================================================
  // COMPUTED SIGNALS
  // ============================================================================

  // Step Navigation Computed
  readonly hasIncompleteSteps = computed(() =>
    this.demoSteps().some(step => !step.completed)
  );

  readonly currentStepIndex = computed(() =>
    this.demoSteps().findIndex(step => !step.completed)
  );

  readonly canProceedToNextStep = computed(() => {
    const currentStepIndex = this.demoSteps().findIndex(step => !step.completed);
    const currentStep = currentStepIndex >= 0 ? this.demoSteps()[currentStepIndex] : null;
    return currentStep?.completed ?? false;
  });

  // Loading States Computed
  readonly isLoading = computed(() =>
    this.isLoadingSteps() ||
    this.isLoadingEstabData() ||
    this.isLoadingDocConfig() ||
    this.isSavingUser() ||
    this.isSavingEstab() ||
    this.isSavingDocs() ||
    this.isSavingCertificate()
  );

  // Step Completion Computed
  readonly completedStepsCount = computed(() =>
    this.demoSteps().filter(step => step.completed).length
  );

  readonly totalStepsCount = computed(() => this.demoSteps().length);

  readonly progressPercentage = computed(() => {
    const total = this.demoSteps().length;
    const completed = this.demoSteps().filter(step => step.completed).length;
    return total > 0 ? (completed / total) * 100 : 0;
  });

  // Data Availability Computed
  readonly hasEstabData = computed(() => this.establecimientos().length > 0);
  readonly hasDocConfig = computed(() => this.docsConfig().length > 0);
  readonly hasUserData = computed(() => this.user() !== null);

  // Current Step Info
  readonly currentStep = computed(() => {
    const index = this.demoSteps().findIndex(step => !step.completed);
    return index >= 0 ? this.demoSteps()[index] : null;
  });

  readonly nextStep = computed(() => {
    const currentIndex = this.demoSteps().findIndex(step => !step.completed);
    const nextIndex = currentIndex + 1;
    return nextIndex < this.demoSteps().length ? this.demoSteps()[nextIndex] : null;
  });

  readonly previousStep = computed(() => {
    const currentIndex = this.demoSteps().findIndex(step => !step.completed);
    const prevIndex = currentIndex - 1;
    return prevIndex >= 0 ? this.demoSteps()[prevIndex] : null;
  });

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  private readonly _companyDemoStepService = inject(CompanyDemoStepService);
  private readonly _estabService = inject(EstablishmentService);
  private readonly _formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly _createDocConfigUseCase = inject(CreateDocConfigUseCase);
  private readonly _updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase);
  private readonly _firmaElectronicaService = inject(FirmaElectronicaService);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly _toasterService = inject(ToastrNotificationService);
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  constructor() {
    this.initializeUserData();
  }

  // ============================================================================
  // DATA LOADING METHODS
  // ============================================================================

  loadCompanyDemoSteps(): void {
    this.isLoadingSteps.set(true);

    this._companyDemoStepService.get({}).pipe(
      takeUntilDestroyed(this._destroyRef),
      catchError((error: unknown) => {
        console.error('Error loading demo steps:', error);
        this._toasterService.show({
          type: 'error',
          message: 'Error al cargar los pasos del asistente'
        });
        this.isLoadingSteps.set(false);
        return of(null);
      })
    ).subscribe((response) => {
      if (response?.code === '1') {
        const tempArray = JSON.parse(response.payload as string);
        const demoSteps = tempArray['companyDemoSteps'] as DemoStep[];

        this.demoSteps.set(demoSteps);
        this.isLoadingSteps.set(false);

        this.updateStepCompletionStatus();
        this.handleIncompleteSteps();
      } else {
        this.isLoadingSteps.set(false);
      }
    });
  }

  loadEstabData(): void {
    this.isLoadingEstabData.set(true);

    this._estabService.getDataForm().pipe(
      takeUntilDestroyed(this._destroyRef),
      catchError((error: unknown) => {
        console.error('Error loading establishment data:', error);
        this._toasterService.show({
          type: 'error',
          message: 'Error al cargar datos de establecimiento'
        });
        this.isLoadingEstabData.set(false);
        return of({ cantones: [], actividadesEconomica: [], agentesRetencion: [], contribuyentes: [] });
      })
    ).subscribe((response: { cantones?: Canton[]; actividadesEconomica?: ActividadEconomica[]; agentesRetencion?: AgenteRetencion[]; contribuyentes?: Contribuyente[] }) => {
      const cantones = response.cantones || [];
      const actividadesEconomica = response.actividadesEconomica || [];
      const agentesRetencion = response.agentesRetencion || [];
      const contribuyentes = response.contribuyentes || [];

      this.cantones.set(cantones);
      this.actividadesEconomica.set(actividadesEconomica);
      this.agentesRetencion.set(agentesRetencion);
      this.contribuyentes.set(contribuyentes);
      this.isLoadingEstabData.set(false);
    });
  }

  loadDocConfig(): void {
    this.isLoadingDocConfig.set(true);

    this._formDataDocConfig.execute().pipe(
      takeUntilDestroyed(this._destroyRef),
      catchError((error: unknown) => {
        console.error('Error loading doc config:', error);
        this._toasterService.show({
          type: 'error',
          message: 'Error al cargar configuración de documentos'
        });
        this.isLoadingDocConfig.set(false);
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

        this.establecimientos.set(establecimientos);
        this.currentEstab.set(currentEstab);
        this.docsConfig.set(combinedData);
        this.isLoadingDocConfig.set(false);
      } else {
        this.isLoadingDocConfig.set(false);
      }
    });
  }

  // ============================================================================
  // USER MANAGEMENT METHODS
  // ============================================================================

  initializeUserData(): void {
    const decodedToken = this._tokenUseCase.getUserData();
    if (decodedToken) {
      this.user.set(decodedToken);
    }
  }

  // ============================================================================
  // STEP MANAGEMENT METHODS
  // ============================================================================

  updateStepCompletionStatus(): void {
    const updatedSteps = this.demoSteps().map(step => ({
      ...step,
      completed: this.getStepCompletionStatus(step.code),
    }));

    this.demoSteps.set(updatedSteps);
  }

  getStepCompletionStatus(stepCode: string): boolean {
    switch (stepCode) {
      case 'I': return true; // Welcome step is always completed
      case 'II': return this.userUpdated();
      case 'III': return this.estabRegistered();
      case 'IV': return this.tipoContribuyenteRegistered();
      case 'V': return this.docsUpdated();
      case 'VI': return this.certificateUpdated();
      case 'VII': return true; // Completion step is always completed
      default: return false;
    }
  }

  handleIncompleteSteps(): void {
    const incompleteSteps = this.demoSteps().filter(step => !step.completed);

    if (incompleteSteps.length > 0) {
      const firstIncompleteStep = incompleteSteps[0];
      this.loadStepData(firstIncompleteStep.code);
    }
  }

  loadStepData(stepCode: string): void {
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
  }

  // ============================================================================
  // STEP COMPLETION METHODS
  // ============================================================================

  markUserStepCompleted(): void {
    this.userUpdated.set(true);
    this.updateStepCompletionStatus();
  }

  markEstabStepCompleted(): void {
    this.estabRegistered.set(true);
    this.updateStepCompletionStatus();
  }

  markContribuyenteStepCompleted(): void {
    this.tipoContribuyenteRegistered.set(true);
    this.updateStepCompletionStatus();
  }

  markDocsStepCompleted(): void {
    this.docsUpdated.set(true);
    this.updateStepCompletionStatus();
  }

  markCertificateStepCompleted(): void {
    this.certificateUpdated.set(true);
    this.updateStepCompletionStatus();
  }

  // ============================================================================
  // UI STATE METHODS
  // ============================================================================

  addEmail(email: string): void {
    const currentEmails = this.emails();
    if (!currentEmails.includes(email)) {
      this.emails.set([...currentEmails, email]);
    }
  }

  removeEmail(email: string): void {
    const currentEmails = this.emails();
    this.emails.set(currentEmails.filter(e => e !== email));
  }

  addTelephone(telephone: string): void {
    const currentTelephones = this.telephones();
    if (!currentTelephones.includes(telephone)) {
      this.telephones.set([...currentTelephones, telephone]);
    }
  }

  removeTelephone(telephone: string): void {
    const currentTelephones = this.telephones();
    this.telephones.set(currentTelephones.filter(t => t !== telephone));
  }

  setFileError(error: boolean): void {
    this.fileError.set(error);
  }

  setSelectedFile(file: File | null): void {
    this.selectedFile.set(file);
  }

  setCurrentEstab(estab: string): void {
    this.currentEstab.set(estab);
  }

  // ============================================================================
  // FORM FACTORY METHODS
  // ============================================================================

  createUserForm(): FormGroup<UserFormControls> {
    return this._fb.group<UserFormControls>({
      nroIdentificacion: this._fb.control(''),
      firstName: this._fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      lastName: this._fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
    });
  }

  createEstabForm(): FormGroup<EstabFormControls> {
    return this._fb.group<EstabFormControls>({
      canton: this._fb.control(''),
      estab: this._fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]),
      nombreComercial: this._fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(300)
      ]),
      dirEstablecimiento: this._fb.control('', [
        Validators.required,
        Validators.maxLength(300)
      ]),
      telefono: this._fb.control(''),
      correo: this._fb.control(''),
      ptosEmi: this._fb.array<FormGroup<PtoEmiFormControls>>([]),
      hasInventory: this._fb.control(false),
      bodegas: this._fb.array<FormGroup<BodegaFormControls>>([]),
    });
  }

  createTipoContribuyenteForm(): FormGroup {
    return this._fb.group({
      actividad: ['', Validators.required],
      agenteRetencion: '',
      contribuyente: ['', Validators.required],
      contribuyenteEspecial: [''],
      obligadoContabilidad: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
    });
  }

  createCertificateForm(): FormGroup {
    return this._fb.group({
      contrasenia: ['', Validators.required],
      fechaCaducidad: ['', Validators.required],
      fileSign: [null, Validators.required],
    });
  }

  // ============================================================================
  // FORM ARRAY FACTORY METHODS
  // ============================================================================

  createBodegaForm(): FormGroup<BodegaFormControls> {
    return this._fb.group<BodegaFormControls>({
      descripcion: this._fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(300),
      ]),
      direccion: this._fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(300),
      ]),
      telefono: this._fb.control(''),
    });
  }

  createPtoEmiForm(): FormGroup<PtoEmiFormControls> {
    return this._fb.group<PtoEmiFormControls>({
      ptoEmi: this._fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]),
      ambiente: this._fb.control('', Validators.required),
    });
  }

  // ============================================================================
  // RESET METHODS
  // ============================================================================

  resetWizard(): void {
    this.cantones.set(initialState.cantones);
    this.actividadesEconomica.set(initialState.actividadesEconomica);
    this.agentesRetencion.set(initialState.agentesRetencion);
    this.contribuyentes.set(initialState.contribuyentes);
    this.ambientes.set(initialState.ambientes);
    this.establecimientos.set(initialState.establecimientos);
    this.puntosEmision.set(initialState.puntosEmision);
    this.docs.set(initialState.docs);
    this.demoSteps.set(initialState.demoSteps);
    this.docsConfig.set(initialState.docsConfig);
    this.emails.set(initialState.emails);
    this.telephones.set(initialState.telephones);
    this.currentEstab.set(initialState.currentEstab);
    this.fileError.set(initialState.fileError);
    this.selectedFile.set(initialState.selectedFile);
    this.userUpdated.set(initialState.userUpdated);
    this.estabRegistered.set(initialState.estabRegistered);
    this.tipoContribuyenteRegistered.set(initialState.tipoContribuyenteRegistered);
    this.docsUpdated.set(initialState.docsUpdated);
    this.certificateUpdated.set(initialState.certificateUpdated);
    this.isLoadingSteps.set(initialState.isLoadingSteps);
    this.isLoadingEstabData.set(initialState.isLoadingEstabData);
    this.isLoadingDocConfig.set(initialState.isLoadingDocConfig);
    this.isSavingUser.set(initialState.isSavingUser);
    this.isSavingEstab.set(initialState.isSavingEstab);
    this.isSavingDocs.set(initialState.isSavingDocs);
    this.isSavingCertificate.set(initialState.isSavingCertificate);
    this.user.set(initialState.user);
    this.isLinear.set(initialState.isLinear);
  }

  resetStepCompletion(): void {
    this.userUpdated.set(false);
    this.estabRegistered.set(false);
    this.tipoContribuyenteRegistered.set(false);
    this.docsUpdated.set(false);
    this.certificateUpdated.set(false);
  }
}
