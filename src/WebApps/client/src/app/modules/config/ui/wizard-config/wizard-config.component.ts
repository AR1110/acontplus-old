// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import { Component, inject, ViewChild, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Angular CDK
import { BACKSLASH, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Angular Material
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Third-party Libraries
import Swal from 'sweetalert2';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// Core Components & Services
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';

// Shared Components & Directives
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { AmbienteSri, ambienteSriOptions } from '@shared/models/ambiente-sri';

// Module Services
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { FirmaElectronicaService } from '@modules/config/services/firma-electronica.service';

// Module Use Cases
import { CreateDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/create-doc-config.use-case';
import { GetDocConfigFormDataUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-form-data.use-case';
import { UpdateUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/update-user-customer.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

// Module Models
import { DemoStep } from '@modules/config/domain/models/wizard-config/demo-step.model';
import { DocConfig } from '@modules/config/domain/models/doc-config.model';
import { UserData } from '@modules/auth/domain/models/user-data.model';
import { Canton } from '@modules/config/domain/models/wizard-config/canton.model';
import { ActividadEconomica } from '@modules/config/domain/models/wizard-config/actividad-economica.model';
import { AgenteRetencion } from '@modules/config/domain/models/wizard-config/agente-retencion.model';
import { Contribuyente } from '@modules/config/domain/models/wizard-config/contribuyente.model';

// Utilities
import { romanToInt } from '@modules/config/domain/models/wizard-config/roman-to-index';

// ============================================================================
// COMPONENT DECORATOR
// ============================================================================

@Component({
  selector: 'app-wizard-config',
  imports: [
    // Angular Material
    MatStepper,
    MatStep,
    MatStepLabel,
    MatButton,
    MatStepperNext,
    MatStepperPrevious,
    MatRadioButton,
    MatChipGrid,
    MatChipRow,
    MatChipInput,
    MatRadioGroup,
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

    // Third-party
    FaIconComponent,

    // Core & Shared
    BreadcrumbComponent,
    TabulatorSemanticUiComponent,
    ToUpperCaseDirective,
    ThemeButtonComponent,
  ],
  templateUrl: './wizard-config.component.html',
  styles: [],
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
  private readonly _firmaElectronicaService = inject(FirmaElectronicaService);
  private readonly _companyDemoStepService = inject(CompanyDemoStepService);
  private readonly _createDocConfigUseCase = inject(CreateDocConfigUseCase);
  private readonly _formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly _updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase);

  // Utility Injections
  private readonly _fb = inject(FormBuilder);
  private readonly _announcer = inject(LiveAnnouncer);

  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================

  readonly separatorKeysCodes = [ENTER, BACKSLASH] as const;
  readonly addOnBlur = true;
  readonly faYoutube: IconProp = faYoutube;

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
      editable: function (cell: any) {
        return cell.getRow().getTreeParent() ? true : false;
      },
      validator: function (cell: any, value: any) {
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
  docsConfig = signal<unknown[]>([]);

  // ============================================================================
  // COMPONENT STATE PROPERTIES
  // ============================================================================

  // User & Authentication
  user = {} as UserData;

  // Form State
  fileError = false;
  selectedFile: File | null = null;
  currentEstab = '';

  // Step Completion Flags
  userUpdated = false;
  estabRegistered = false;
  tipoContribuyenteRegistered = false;
  docsUpdated = false;
  certificateUpdated = false;

  // Stepper Configuration
  isLinear = false;

  // ============================================================================
  // FORM DEFINITIONS
  // ============================================================================

  certificateForm = new FormGroup({
    contrasenia: new FormControl('', [Validators.required]),
    fechaCaducidad: new FormControl('', [Validators.required]),
    fileSign: new FormControl(null, [Validators.required]),
  });

  estabForm = this._fb.group({
    canton: '',
    estab: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    ],
    nombreComercial: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(300)],
    ],
    dirEstablecimiento: ['', [Validators.required, Validators.maxLength(300)]],
    telefono: [''],
    correo: [''],
    ptosEmi: this._fb.array([]),
    hasInventory: [false],
    bodegas: this._fb.array([]),
  });

  userForm = new FormGroup({
    nroIdentificacion: new FormControl(''),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
  });

  tipoContribuyenteForm = this._fb.group({
    actividad: ['', Validators.required],
    agenteRetencion: '',
    contribuyente: ['', Validators.required],
    contribuyenteEspecial: [''],
    obligadoContabilidad: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
    ],
  });

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

  // ============================================================================
  // DATA FETCHING METHODS
  // ============================================================================

  fetchCompanyDemoSteps(): void {
    this._companyDemoStepService.get({}).subscribe((response) => {
      if (response.code === '1') {
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
        _children: (response.tiposDoc as any[]).map((doc) => ({
          ...doc,
          parentId: (pto as any).idPuntoEmision,
          ultimaSecuencia: 0,
        })),
      }));
      this.docsConfig.set(combinedData as []);
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
    this.tipoContribuyenteRegistered = this.getStepCompletionStatus('IV');
    this.docsUpdated = this.getStepCompletionStatus('V');
    this.certificateUpdated = this.getStepCompletionStatus('VI');
  }

  private getStepCompletionStatus(stepCode: string): boolean {
    return this.demoSteps().find((step: DemoStep) => step.code === stepCode)?.completed ?? false;
  }

  private handleIncompleteSteps(): void {
    const incompleteStep = this.demoSteps().find(
      (step: DemoStep) => !step.completed,
    );

    if (incompleteStep) {
      const stepIndex = romanToInt(incompleteStep.code);
      if (stepIndex !== null) {
        this.loadStepData(incompleteStep.code);
        this.stepper.selectedIndex = stepIndex - 1;
      }
    } else {
      this.isLinear = true;
      this.stepper.selectedIndex = 4;
    }
  }

  private loadStepData(stepCode: string): void {
    if (stepCode === 'V') {
      this.fetchEstabData();
    }
    if (stepCode === 'VI') {
      this.fetchDocConfig();
    }
  }

  // ============================================================================
  // FORM FACTORY METHODS
  // ============================================================================

  newBodega(): FormGroup {
    return this._fb.group({
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300),
        ],
      ],
      direccion: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300),
        ],
      ],
      telefono: [''],
    });
  }

  newPtoEmi(): FormGroup {
    return this._fb.group({
      ptoEmi: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      ambiente: ['', Validators.required],
    });
  }

  // ============================================================================
  // FORM ARRAY MANAGEMENT METHODS
  // ============================================================================

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

  // ============================================================================
  // CHIP MANAGEMENT METHODS
  // ============================================================================

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
        this.emails.update((prev) =>
          prev.map((e, i) => (i === index ? value : e)),
        );
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
        this.telephones.update((prev) =>
          prev.map((t, i) => (i === index ? value : t)),
        );
      }
    }
  }

  // ============================================================================
  // FORM VALIDATION METHODS
  // ============================================================================

  private validateBodegas(): boolean {
    if (this.bodegas.length > 0 && !this.bodegas.valid) {
      this.bodegas.markAllAsTouched();
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de las bodegas sean correctos',
      });
      return false;
    }
    return true;
  }

  private validatePuntosEmision(): boolean {
    if (this.ptosEmi.length === 0) {
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      this._toasterService.show({
        type: 'warning',
        message: 'Ingrese al menos un punto de emisión',
      });
      return false;
    }

    if (!this.ptosEmi.valid) {
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      this.ptosEmi.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de los puntos de emisión sean correctos',
      });
      return false;
    }
    return true;
  }

  private validateDocumentos(): boolean {
    const docs = this.docsConfig().flatMap((pto: any) =>
      (pto as any)._children
        .filter((doc: any) => doc.ultimaSecuencia > 0)
        .map((doc: any) => ({
          idPuntoEmision: (pto as any).idPuntoEmision,
          idTipoDocumento: doc.idTipoDocumento,
          ultimaSecuencia: doc.ultimaSecuencia,
        })),
    );

    if (docs.length == 0) {
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      this._toasterService.show({
        type: 'warning',
        message: 'Debe ingresar al menos una secuencial de los documentos',
      });
      return false;
    }
    return true;
  }

  // ============================================================================
  // SAVE METHODS
  // ============================================================================

  saveEstab(): void {
    if (!this.validateBodegas() || !this.validatePuntosEmision()) {
      return;
    }

    const telephone = this.telephones().length > 0
      ? this.telephones().join(SEPARATOR_KEY_CODE.SLASH)
      : null;
    this.estabForm.get('telefono')?.setValue(telephone);

    const correo = this.emails().length > 0
      ? this.emails().join(SEPARATOR_KEY_CODE.SLASH)
      : null;
    this.estabForm.get('correo')?.setValue(correo);

    const dataEstab = {
      ...this.estabForm.value,
      ptosEmi: JSON.stringify(this.estabForm.get('ptosEmi')?.value),
      bodegas: JSON.stringify(this.estabForm.get('bodegas')?.value),
      demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'V')?.id,
    };

    this._estabService.post(dataEstab).subscribe((response) => {
      if (isApiResponse(response)) {
        this._toasterService.show({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.estabRegistered = true;
          this.fetchCompanyDemoSteps();
        }
      }
    });
  }

  saveUser(): void {
    const data = {
      ...structuredClone(this.userForm.value),
      email: this.user.email,
      username: this.user.username,
      demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'IV')?.id,
    };

    const userData = {
      data,
      id: this.user.userId,
    };

    this._updateUserCustomerUseCase.execute(userData).subscribe((response) => {
      if (isApiResponse(response)) {
        this.handleUserSaveResponse(response);
      }
    });
  }

  saveDocs(): void {
    if (!this.validateDocumentos()) {
      return;
    }

    const docs = this.docsConfig().flatMap((pto: any) =>
      (pto as any)._children
        .filter((doc: any) => doc.ultimaSecuencia > 0)
        .map((doc: any) => ({
          idPuntoEmision: (pto as any).idPuntoEmision,
          idTipoDocumento: doc.idTipoDocumento,
          ultimaSecuencia: doc.ultimaSecuencia,
        })),
    );

    const dataToSave = {
      docs: JSON.stringify(docs),
      demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'VI')?.id,
    };

    this._createDocConfigUseCase.execute(dataToSave).subscribe((response) => {
      if (isApiResponse(response)) {
        this.handleDocsSaveResponse(response);
      }
    });
  }

  saveCertificate(): void {
    if (this.certificateForm.valid && this.selectedFile) {
      const formData = {
        contrasenia: this.certificateForm.get('contrasenia')?.value,
        fechaCaducidad: this.certificateForm.get('fechaCaducidad')?.value,
        demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'VII')?.id,
      };

      this._firmaElectronicaService.post(formData, this.selectedFile).subscribe((response) => {
        if (isApiResponse(response)) {
          this.handleCertificateSaveResponse(response);
        }
      });
    }
  }

  saveTipoContribuyente(): void {
    // TODO: Implement save tipo contribuyente logic
  }

  // ============================================================================
  // RESPONSE HANDLING METHODS
  // ============================================================================

  private handleUserSaveResponse(response: any): void {
    if (response.code === '0' && this.stepper) {
      this.stepper.previous();
    }
    if (response.code === '1') {
      this.userUpdated = true;
      this.fetchCompanyDemoSteps();
      this.fetchEstabData();
    }
    if (response.code !== '1') {
      this._toasterService.warning({
        message: response.message,
        title: 'Error al guardar usuario',
        options: {
          positionClass: 'toast-top-center',
        },
      });
    } else {
      this._toasterService.success({ message: response.message });
    }
  }

  private handleDocsSaveResponse(response: any): void {
    if (response.code === '0' && this.stepper) {
      this.stepper.previous();
    }
    if (response.code === '1') {
      this.docsUpdated = true;
      this.fetchCompanyDemoSteps();
    }
    this._toasterService.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
  }

  private handleCertificateSaveResponse(response: any): void {
    if (response.code === '0' && this.stepper) {
      this.stepper.previous();
    }
    if (response.code === '1') {
      this.fetchCompanyDemoSteps();
    }
    this._toasterService.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  onChangeTipoContribuyente(): void {
    const control = this.tipoContribuyenteForm.get('agenteRetencion');
    if (this.tipoContribuyenteForm.get('contribuyente')?.value === '03') {
      control?.disable();
      control?.setValue(null);
    } else {
      control?.enable();
    }
  }

  onFileChange(event: any): void {
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
    const contribuyente = this.tipoContribuyenteForm.get('contribuyente')?.value;
    const dataInfo = this.contribuyentes().find(
      (item) => item.codigo === contribuyente,
    );
    if (contribuyente && dataInfo?.contribuyenteRimpe) {
      Swal.fire({
        icon: 'info',
        html: `<small>${dataInfo.contribuyenteRimpe}</small>`,
      });
    }
  }

  showInfoActividadEconomica(): void {
    const actividad = this.tipoContribuyenteForm.get('actividad')?.value;
    const groupActEconomica = this.actividadesEconomica().find(
      (item) => item.codigo === actividad,
    );
    if (actividad && groupActEconomica?.grupo) {
      Swal.fire({
        icon: 'info',
        html: `<small>${groupActEconomica.grupo}</small>`,
      });
    }
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
        const id = this.demoSteps().find((step: DemoStep) => step.code === 'VII')?.id;
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
