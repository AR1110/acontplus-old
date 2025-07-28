// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Component,
  inject,
  ViewChild,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

// Angular Material
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

// Third-party Libraries
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { of } from 'rxjs';

// Core Components & Services
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';

// Additional imports for consolidated functionality
import {
  MatChipGrid,
  MatChipRow,
  MatChipInput,
  MatChipEditedEvent,
  MatChipInputEvent,
} from '@angular/material/chips';

import { BACKSLASH, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Module Services
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { WizardErrorHandlerService } from './services/wizard-error-handler.service';

// Module Use Cases
import { GetDocConfigFormDataUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-form-data.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

// Module Models
import { ActividadEconomica } from '@modules/config/domain/models/wizard-config/actividad-economica.model';
import { AgenteRetencion } from '@modules/config/domain/models/wizard-config/agente-retencion.model';
import { Contribuyente } from '@modules/config/domain/models/wizard-config/contribuyente.model';
import { DemoStep } from '@modules/config/domain/models/wizard-config/demo-step.model';
import { Canton } from '@modules/config/domain/models/wizard-config/canton.model';
import { DocConfig } from '@modules/config/domain/models/doc-config.model';
import { UserData } from '@modules/auth/domain/models/user-data.model';

// Utilities
import { romanToInt } from '@modules/config/domain/models/wizard-config/roman-to-index';
import { AmbienteSri, ambienteSriOptions } from '@shared/models/ambiente-sri';

// ============================================================================
// INTERFACES
// ============================================================================

interface TabulatorCell {
  getRow(): {
    getTreeParent(): unknown;
  };
}

interface TabulatorValidatorResult {
  valid: boolean;
  message: string;
}

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

interface FileChangeEvent {
  target: {
    files: FileList;
  };
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
  // Consolidated tipoContribuyente fields
  actividad: FormControl<string | null>;
  agenteRetencion: FormControl<string | null>;
  contribuyente: FormControl<string | null>;
  contribuyenteEspecial: FormControl<string | null>;
  obligadoContabilidad: FormControl<string | null>;
}

// ============================================================================
// COMPONENT DECORATOR
// ============================================================================

@Component({
  selector: 'app-wizard-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // Angular Material
    MatStepper,
    MatStep,
    MatStepLabel,
    MatButton,
    MatStepperNext,
    MatStepperPrevious,
    MatCardContent,
    MatCard,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelectModule,
    // Forms
    ReactiveFormsModule,
    FormsModule,
    // Core & Shared
    BreadcrumbComponent,
    TabulatorComponent,

    // Additional UI Components
    MatChipGrid,
    MatChipRow,
    MatChipInput,

    // Router
    RouterModule,
  ],
  templateUrl: './wizard-config.component.html',
  styleUrl: './wizard-config.component.scss',
})
export class WizardConfigComponent implements OnInit {
  // ============================================================================
  // VIEW CHILD & INJECTIONS
  // ============================================================================

  @ViewChild('stepper') stepper!: MatStepper;

  // Service Injections
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly _toasterService = inject(ToastrNotificationService);
  private readonly _estabService = inject(EstablishmentService);
  private readonly _companyDemoStepService = inject(CompanyDemoStepService);
  private readonly _formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly _errorHandler = inject(WizardErrorHandlerService);

  private readonly _announcer = inject(LiveAnnouncer);

  // Utility Injections
  private readonly _fb = inject(FormBuilder);

  // Table Configuration
  readonly columnNames = [
    { title: 'idPuntoEmision', field: 'idPuntoEmision', visible: false },
    { title: 'Pto. Emi', field: 'ptoEmi' },
    { title: 'idTipoDocumento', field: 'idTipoDocumento', visible: false },
    { title: 'Documento', field: 'descripcion', width: 200 },
    {
      title: 'Ultima Secuencia',
      field: 'ultimaSecuencia',
      editor: 'number',
      editorParams: {
        min: 0,
        step: 1,
      },
      editable: function (cell: TabulatorCell): boolean {
        return cell.getRow().getTreeParent() ? true : false;
      },
      validator: function (
        cell: TabulatorCell,
        value: unknown,
      ): boolean | TabulatorValidatorResult {
        if (cell.getRow().getTreeParent()) {
          if (value === '' || value === null) {
            return { valid: false, message: 'Este campo es requerido' };
          } else if (!Number.isInteger(Number(value)) || Number(value) < 0) {
            return {
              valid: false,
              message: 'Debe ser un número entero positivo',
            };
          }
        }
        return true;
      },
    },
  ];

  // ============================================================================
  // SIGNAL PROPERTIES
  // ============================================================================

  // Data Signals
  cantones = signal<Canton[]>([]);
  actividadesEconomica = signal<ActividadEconomica[]>([]);
  agentesRetencion = signal<AgenteRetencion[]>([]);
  contribuyentes = signal<Contribuyente[]>([]);
  ambientes = signal<AmbienteSri[]>(ambienteSriOptions);
  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  docs = signal<DocConfig[]>([]);
  demoSteps = signal<DemoStep[]>([]);

  // UI State Signals
  emails = signal<string[]>([]);
  telephones = signal<string[]>([]);
  docsConfig = signal<EstabWithChildren[]>([]);

  // User Step State
  showPassword = false;
  showConfirmPassword = false;
  userSubmitted = false;

  // Computed signals for derived state
  readonly currentStepIndex = computed(() => this.demoSteps().findIndex((step) => !step.completed));

  // User & Authentication
  user = {} as UserData;

  // Form State
  fileError = false;
  selectedFile: File | null = null;
  currentEstab = '';
  loading = signal(false);

  // Step Completion Flags
  userUpdated = false;
  estabRegistered = false;
  docsUpdated = false;
  certificateUpdated = false;

  // Stepper Configuration
  isLinear = false;

  // Chip input configuration
  readonly separatorKeysCodes = [ENTER, BACKSLASH] as const;
  readonly addOnBlur = true;

  // ============================================================================
  // FORM DEFINITIONS
  // ============================================================================

  // Static validator function
  private static passwordsMatchValidator(control: AbstractControl) {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  certificateForm = new FormGroup({
    contrasenia: new FormControl('', [Validators.required]),
    fechaCaducidad: new FormControl('', [Validators.required]),
    fileSign: new FormControl(null, [Validators.required]),
  });

  estabForm = this._fb.group<EstabFormControls>({
    canton: this._fb.control(''),
    estab: this._fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    nombreComercial: this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(300),
    ]),
    dirEstablecimiento: this._fb.control('', [Validators.required, Validators.maxLength(300)]),
    telefono: this._fb.control(''),
    correo: this._fb.control(''),
    ptosEmi: this._fb.array<FormGroup<PtoEmiFormControls>>([]),
    hasInventory: this._fb.control(false),
    bodegas: this._fb.array<FormGroup<BodegaFormControls>>([]),
    // Consolidated tipoContribuyente fields
    actividad: this._fb.control('', [Validators.required]),
    agenteRetencion: this._fb.control(''),
    contribuyente: this._fb.control('', [Validators.required]),
    contribuyenteEspecial: this._fb.control(''),
    obligadoContabilidad: this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
  });

  // Removed tipoContribuyenteForm - consolidated into estabForm

  userForm = this._fb.group(
    {
      nroIdentificacion: this._fb.control('', [Validators.required, Validators.minLength(10)]),
      username: this._fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
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
      email: this._fb.control('', [Validators.email]),
      phone: this._fb.control('', [Validators.pattern(/^[\d\s\-+()]+$/)]),
      password: this._fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this._fb.control('', [Validators.required]),
    },
    { validators: [WizardConfigComponent.passwordsMatchValidator] },
  );

  // ============================================================================
  // FORM GETTERS
  // ============================================================================

  get bodegas(): FormArray {
    return this.estabForm.get('bodegas') as FormArray;
  }

  get ptosEmi(): FormArray {
    return this.estabForm.get('ptosEmi') as FormArray;
  }

  // ============================================================================
  // LIFECYCLE METHODS
  // ============================================================================

  ngOnInit(): void {
    this.initializeUserData();
    this.fetchCompanyDemoSteps();
    this.initializeForms();
  }

  // ============================================================================
  // INITIALIZATION METHODS
  // ============================================================================

  private initializeUserData(): void {
    const decodedToken = this._tokenUseCase.getUserData();
    if (decodedToken) {
      this.user = decodedToken;
    }
  }

  private initializeForms(): void {
    // Initialize establishment form with at least one punto de emisión
    if (this.ptosEmi.length === 0) {
      this.addPtoEmi();
    }
  }

  // ============================================================================
  // DATA FETCHING METHODS
  // ============================================================================

  fetchCompanyDemoSteps(): void {
    this._companyDemoStepService
      .get({})
      .pipe(
        catchError((error: unknown) => {
          this._errorHandler.handleApiError(error, {
            operation: 'fetching demo steps',
            component: 'WizardConfigComponent',
          });
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response?.code === '1') {
          const tempArray = JSON.parse(response.payload as string);
          this.demoSteps.set(tempArray['companyDemoSteps'] as DemoStep[]);
          this.updateStepCompletionStatus();
          this.handleIncompleteSteps();
        }
      });
  }

  fetchDocConfig(): void {
    this._formDataDocConfig.execute().subscribe((response) => {
      this.establecimientos.set(response.establecimientos);
      this.currentEstab = this.establecimientos()[0].nombreComercial;
      const combinedData = this.establecimientos().map((pto) => ({
        ...pto,
        _children: (response.tiposDoc as DocConfigItem[]).map((doc) => ({
          ...doc,
          parentId: pto.puntosEmision[0]?.idPuntoEmision || '',
          ultimaSecuencia: 0,
        })),
      }));
      console.debug(combinedData);
      this.docsConfig.set(combinedData as EstabWithChildren[]);
    });
  }

  fetchEstabData(): void {
    this._estabService.getDataForm().subscribe((response) => {
      this.cantones.set(response.cantones);
      this.actividadesEconomica.set(response.actividadesEconomica);
      this.agentesRetencion.set(response.agentesRetencion);
      this.contribuyentes.set(response.contribuyentes);
    });
  }

  // ============================================================================
  // STEP MANAGEMENT METHODS
  // ============================================================================

  private updateStepCompletionStatus(): void {
    this.userUpdated = this.getStepCompletionStatus('II');
    this.estabRegistered = this.getStepCompletionStatus('III');
    // tipoContribuyenteRegistered is now part of estabRegistered
    this.docsUpdated = this.getStepCompletionStatus('IV');
    this.certificateUpdated = this.getStepCompletionStatus('V');
  }

  private getStepCompletionStatus(stepCode: string): boolean {
    return this.demoSteps().find((step: DemoStep) => step.code === stepCode)?.completed ?? false;
  }

  private handleIncompleteSteps(): void {
    const incompleteStep = this.demoSteps().find((step: DemoStep) => !step.completed);

    if (incompleteStep) {
      const stepIndex = romanToInt(incompleteStep.code);
      if (stepIndex !== null && stepIndex > 0) {
        this.loadStepData(incompleteStep.code);
        const targetIndex = stepIndex - 1;
        // Ensure the target index is within bounds
        if (targetIndex >= 0 && targetIndex < this.stepper.steps.length) {
          this.stepper.selectedIndex = targetIndex;
        }
      }
    } else {
      this.isLinear = true;
      // Set to the last step index, ensuring it's within bounds
      const lastStepIndex = this.stepper.steps.length - 1;
      this.stepper.selectedIndex = Math.max(0, lastStepIndex);
    }
  }

  private loadStepData(stepCode: string): void {
    if (stepCode === 'III') {
      this.fetchEstabData();
      this.fetchDocConfig();
    } else if (stepCode === 'V') {
      this.fetchDocConfig();
    }
  }

  // ============================================================================
  // CONSOLIDATED STEP METHODS
  // ============================================================================

  // User Step Methods

  saveUser(): void {
    this.userSubmitted = true;
    if (this.userForm.valid) {
      // TODO: Implement user save logic
      this._toasterService.show({
        type: 'success',
        message: 'Usuario guardado exitosamente',
      });
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Establishment Step Methods
  addBodega(): void {
    this.bodegas.push(this.newBodega());
  }

  removeBodega(index: number): void {
    this.bodegas.removeAt(index);
  }

  addPtoEmi(): void {
    this.ptosEmi.push(this.newPtoEmi());
  }

  removePtoEmi(index: number): void {
    this.ptosEmi.removeAt(index);
  }

  private newBodega(): FormGroup {
    return this._fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      direccion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      telefono: [''],
    });
  }

  private newPtoEmi(): FormGroup {
    return this._fb.group({
      ptoEmi: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      ambiente: ['', Validators.required],
    });
  }

  // Chip Management Methods
  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.update((prev) => [...prev, value]);
      event.chipInput!.clear();
    }
  }

  removeEmail(value: string): void {
    const index = this.emails().indexOf(value);
    if (index >= 0) {
      this.emails.update((prev) => prev.filter((_, i) => i !== index));
      this._announcer.announce(`Removed ${value}`);
    }
  }

  editEmail(email: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(email);
    } else {
      const index = this.emails().indexOf(email);
      if (index >= 0) {
        this.emails.update((prev) => prev.map((e, i) => (i === index ? value : e)));
      }
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.telephones.update((prev) => [...prev, value]);
      event.chipInput!.clear();
    }
  }

  removeTelephone(value: string): void {
    const index = this.telephones().indexOf(value);
    if (index >= 0) {
      this.telephones.update((prev) => prev.filter((_, i) => i !== index));
      this._announcer.announce(`Removed ${value}`);
    }
  }

  editTelephone(telephone: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeTelephone(telephone);
    } else {
      const index = this.telephones().indexOf(telephone);
      if (index >= 0) {
        this.telephones.update((prev) => prev.map((t, i) => (i === index ? value : t)));
      }
    }
  }

  // TrackBy Functions
  trackByEmail(_: number, email: string): string {
    return email;
  }

  trackByTelephone(_: number, telephone: string): string {
    return telephone;
  }

  trackByBodega(index: number): number {
    return index;
  }

  trackByPtoEmi(index: number): number {
    return index;
  }

  // ============================================================================
  // SAVE METHODS
  // ============================================================================

  saveEstab(): void {
    // Bodegas validation
    if (this.bodegas.length > 0 && !this.bodegas.valid) {
      this.bodegas.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de las bodegas sean correctos',
      });
      return;
    }
    // Puntos de emisión validation
    if (this.ptosEmi.length === 0) {
      this._toasterService.show({
        type: 'warning',
        message: 'Ingrese al menos un punto de emisión',
      });
      return;
    }
    if (!this.ptosEmi.valid) {
      this.ptosEmi.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de los puntos de emisión sean correctos',
      });
      return;
    }
    if (!this.estabForm.valid) {
      // Mark all fields as touched to show validation errors
      this.estabForm.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message:
          'Complete todos los campos requeridos del establecimiento y configuración de contribuyente',
      });
      return;
    }

    this.loading.set(true);

    const telephone =
      this.telephones().length > 0 ? this.telephones().join(SEPARATOR_KEY_CODE.SLASH) : null;
    this.estabForm.get('telefono')?.setValue(telephone);

    const correo = this.emails().length > 0 ? this.emails().join(SEPARATOR_KEY_CODE.SLASH) : null;
    this.estabForm.get('correo')?.setValue(correo);

    const dataEstab = {
      ...this.estabForm.value,
      ptosEmi: JSON.stringify(this.estabForm.get('ptosEmi')?.value),
      bodegas: JSON.stringify(this.estabForm.get('bodegas')?.value),
      // Include consolidated tipoContribuyente data
      tipoContribuyente: {
        actividad: this.estabForm.get('actividad')?.value,
        agenteRetencion: this.estabForm.get('agenteRetencion')?.value,
        contribuyente: this.estabForm.get('contribuyente')?.value,
        contribuyenteEspecial: this.estabForm.get('contribuyenteEspecial')?.value,
        obligadoContabilidad: this.estabForm.get('obligadoContabilidad')?.value,
      },
      demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'III')?.id,
    };

    this._estabService.post(dataEstab).subscribe((response) => {
      this.loading.set(false);
      if (isApiResponse(response)) {
        this._toasterService.show({
          type: response.code == '1' ? 'success' : 'warning',
          message:
            response.code == '1'
              ? 'Establecimiento y configuración de contribuyente guardados exitosamente'
              : response.message,
        });
        if (response.code == '1') {
          this.estabRegistered = true;
          this.fetchCompanyDemoSteps();
        }
      }
    });
  }

  saveDocs(): void {
    const docs = this.docsConfig().flatMap((pto: EstabWithChildren) =>
      pto._children
        .filter((doc: DocConfigItem) => doc.ultimaSecuencia > 0)
        .map(
          (doc: DocConfigItem) =>
            ({
              idConfiguracionDocumento: 0,
              idPuntoEmision: pto.puntosEmision[0]?.idPuntoEmision || '',
              idTipoDocumento: Number(doc.idTipoDocumento),
              estado: true,
              ultimaSecuencia: doc.ultimaSecuencia,
              descripcion: doc.descripcion || '',
              infoAdicional: false,
            }) as DocConfig,
        ),
    );
    // TODO: Implement documents save logic
    this._toasterService.show({
      type: 'success',
      message: `${docs.length} documentos guardados exitosamente`,
    });
  }

  saveCertificate(): void {
    if (this.certificateForm.valid && this.selectedFile) {
      // TODO: Implement certificate save logic
      this._toasterService.show({
        type: 'success',
        message: 'Certificado guardado exitosamente',
      });
    }
  }

  // Removed saveTipoContribuyente - consolidated into saveEstab

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  onChangeTipoContribuyente(): void {
    const control = this.estabForm.get('agenteRetencion');
    if (this.estabForm.get('contribuyente')?.value === '03') {
      control?.disable();
      control?.setValue(null);
    } else {
      control?.enable();
    }
  }

  onFileChange(event: FileChangeEvent): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.p12')) {
      this.selectedFile = file;
      this.fileError = false;
    } else {
      this.fileError = true;
    }
  }

  // ============================================================================
  // INFO DISPLAY METHODS
  // ============================================================================

  showInfoTipoContribuyente(): void {
    const contribuyente = this.estabForm.get('contribuyente')?.value;
    const dataInfo = this.contribuyentes().find((item) => item.codigo === contribuyente);
    if (contribuyente && dataInfo?.contribuyenteRimpe) {
      Swal.fire({
        icon: 'info',
        html: `<small>${dataInfo.contribuyenteRimpe}</small>`,
      });
    }
  }

  showInfoActividadEconomica(): void {
    const actividad = this.estabForm.get('actividad')?.value;
    const groupActEconomica = this.actividadesEconomica().find((item) => item.codigo === actividad);
    if (actividad && groupActEconomica?.grupo) {
      Swal.fire({
        icon: 'info',
        html: `<small>${groupActEconomica.grupo}</small>`,
      });
    }
  }

  // ============================================================================
  // TRACKBY FUNCTIONS
  // ============================================================================

  trackByStep(_: number, step: DemoStep): string {
    return step.code;
  }
  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  skipAndFinish(): void {
    this.stepper.previous();
    Swal.fire({
      title: 'Info',
      icon: 'info',
      text: `Esta seguro de saltar este paso?, recuerde que si va a usar el módulo de facturación electrónica,
       debe de subir una firma electrónica!`,
    }).then((response) => {
      if (response.isConfirmed) {
        const id = this.demoSteps().find((step: DemoStep) => step.code === 'V')?.id;
        this._companyDemoStepService.post(Number(id)).subscribe((response) => {
          if (response.code === '1') {
            this.fetchCompanyDemoSteps();
            this.stepper.next();
          }
          this._toasterService.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
        });
      }
    });
  }
}
