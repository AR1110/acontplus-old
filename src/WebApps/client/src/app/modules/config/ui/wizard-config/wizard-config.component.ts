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
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';

// Angular Material
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

// Third-party Libraries
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { of } from 'rxjs';

// Core Components & Services
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TabulatorTable, InputChip, DynamicCard, Button } from '@acontplus/ng-components';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';

// Module Services
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { WizardErrorHandlerService } from './services/wizard-error-handler.service';

// Module Use Cases
import { ELECTRONIC_SIGNATURE_HTTP_TOKEN } from '@modules/config/data/config-token';
import { GetDocConfigFormDataUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-form-data.use-case';
import { UpdateUserCustomerUseCase } from '@modules/config/application/use-cases/user-customer/update-user-customer.use-case';
import { CreateDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/create-doc-config.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

// Module Models
import { ActividadEconomica } from '@modules/config/data/models/wizard-config/actividad-economica.model';
import { AgenteRetencion } from '@modules/config/data/models/wizard-config/agente-retencion.model';
import { ElectronicSignatureParam } from '@modules/config/data/models/electronic-signature.model';
import { Contribuyente } from '@modules/config/data/models/wizard-config/contribuyente.model';
import { DemoStep } from '@modules/config/data/models/wizard-config/demo-step.model';
import { Canton } from '@modules/config/data/models/wizard-config/canton.model';
import { DocConfig } from '@modules/config/data/models/doc-config.model';
import { UserData } from '@modules/auth/domain/models/user-data.model';

// Shared Components & Models
import { NgDynamicSelectComponent } from '@shared/components/ng-dynamic-select/ng-dynamic-select.component';
import { SelectOption } from '@shared/models/select-option';

// Utilities
import { romanToInt } from '@modules/config/data/models/wizard-config/roman-to-index';
import { AmbienteSri, ambienteSriOptions } from '@shared/models/ambiente-sri';

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

@Component({
  selector: 'app-wizard-config',
  templateUrl: './wizard-config.component.html',
  styleUrls: ['./wizard-config.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatInput,
    MatLabel,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
    MatTooltipModule,
    BreadcrumbComponent,
    TabulatorTable,
    InputChip,
    Button,
    NgDynamicSelectComponent,
  ],
})
export class WizardConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly _toasterService = inject(ToastrNotificationService);
  private readonly _estabService = inject(EstablishmentService);
  private readonly _companyDemoStepService = inject(CompanyDemoStepService);
  private readonly _formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly _errorHandler = inject(WizardErrorHandlerService);
  private readonly _updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase);
  private readonly _electronicSignatureHttp = inject(ELECTRONIC_SIGNATURE_HTTP_TOKEN);
  private readonly _createDocConfigUseCase = inject(CreateDocConfigUseCase);

  private readonly _fb = inject(FormBuilder);

  // Options for obligado contabilidad select
  readonly obligadoContabilidadOptions = [
    { value: 'SI', label: 'SI' },
    { value: 'NO', label: 'NO' },
  ];

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
  cantones = signal<Canton[]>([]);
  actividadesEconomica = signal<ActividadEconomica[]>([]);
  agentesRetencion = signal<AgenteRetencion[]>([]);
  contribuyentes = signal<Contribuyente[]>([]);
  ambientes = signal<AmbienteSri[]>(ambienteSriOptions);
  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  docs = signal<DocConfig[]>([]);
  demoSteps = signal<DemoStep[]>([]);
  emails = signal<string[]>([]);
  telephones = signal<string[]>([]);
  docsConfig = signal<EstabWithChildren[]>([]);
  isLoadingDocs = signal<boolean>(false);
  loadError = signal<string | null>(null);

  showPassword = false;
  showConfirmPassword = false;
  userSubmitted = false;

  readonly currentStepIndex = computed(() => this.demoSteps().findIndex((step) => !step.completed));

  readonly actividadesEconomicaOptions = computed<SelectOption[]>(() =>
    this.actividadesEconomica().map((actividad) => ({
      value: actividad.codigo,
      viewValue: actividad.descripcion,
    })),
  );

  user = {} as UserData;

  fileError = false;
  selectedFile: File | null = null;
  currentEstab = '';
  userUpdated = false;
  estabRegistered = false;
  docsUpdated = false;
  certificateUpdated = false;

  isLinear = false;

  private static passwordsMatchValidator(control: AbstractControl) {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // Only validate if password is provided
    if (!password && !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  certificateForm = new FormGroup({
    contrasenia: new FormControl('', [Validators.required]),
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
    obligadoContabilidad: this._fb.control('', [Validators.required]),
  });

  userForm = this._fb.group(
    {
      idCard: this._fb.control('', [Validators.required, Validators.minLength(10)]),
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
      phoneNumber: this._fb.control('', [Validators.pattern(/^[\d\s\-+()]*$/)]), // Made pattern accept empty string
      password: this._fb.control('', [Validators.minLength(6)]), // Removed required validator
      confirmPassword: this._fb.control(''), // Removed required validator
    },
    { validators: [WizardConfigComponent.passwordsMatchValidator] },
  );

  get bodegas(): FormArray {
    return this.estabForm.get('bodegas') as FormArray;
  }

  get ptosEmi(): FormArray {
    return this.estabForm.get('ptosEmi') as FormArray;
  }

  ngOnInit(): void {
    this.initializeUserData();
    this.initializeForms();
  }

  ngAfterViewInit(): void {
    // Fetch demo steps after view is initialized to ensure stepper is available
    this.fetchCompanyDemoSteps();
  }

  private initializeUserData(): void {
    const decodedToken = this._tokenUseCase.getUserData();
    if (decodedToken) {
      this.user = decodedToken;

      // Patch email and username values to user form

      const trimmedUsername = decodedToken.username.includes('@')
        ? decodedToken.username.split('@')[0]
        : decodedToken.username;

      this.userForm.patchValue({
        email: decodedToken.email,
        username: trimmedUsername,
      });
    }
  }

  private initializeForms(): void {
    if (this.ptosEmi.length === 0) {
      this.addPtoEmi();
    }
  }

  fetchCompanyDemoSteps(): void {
    this._companyDemoStepService
      .get()
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
          this.demoSteps.set(tempArray.companyDemoSteps as DemoStep[]);
          this.updateStepCompletionStatus();
          this.handleIncompleteSteps();
        }
      });
  }

  fetchDocConfig(): void {
    this.isLoadingDocs.set(true);
    this.loadError.set(null);

    this._formDataDocConfig.execute().subscribe({
      next: (response) => {
        try {
          this.establecimientos.set(response.establecimientos);

          if (!response.establecimientos?.length) {
            throw new Error('No se encontraron establecimientos');
          }

          this.currentEstab = this.establecimientos()[0]?.nombreComercial || '';

          console.debug('Document configuration loaded successfully', this.establecimientos());

          const combinedData = this.establecimientos().map((pto) => ({
            ...pto,
            ptoEmi: pto.puntosEmision?.[0]?.ptoEmi || '',
            _children: (response.tiposDoc || []).map((doc) => ({
              ...doc,
              parentId: pto.puntosEmision?.[0]?.idPuntoEmision || '',
              ultimaSecuencia: doc.codigoSri ? 0 : 1,
            })),
          }));

          this.docsConfig.set(combinedData as EstabWithChildren[]);
          console.debug('Document configuration loaded successfully', combinedData);
        } catch (error) {
          console.error('Error processing document configuration:', error);
          this.loadError.set('Error al procesar la configuración de documentos');
          this.docsConfig.set([]);
        }
      },
      error: (error) => {
        console.error('Error fetching document configuration:', error);
        this.loadError.set('Error al cargar la configuración de documentos');
        this.docsConfig.set([]);
      },
      complete: () => {
        this.isLoadingDocs.set(false);
      },
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

  private updateStepCompletionStatus(): void {
    this.userUpdated = this.getStepCompletionStatus('II');
    console.debug('Update step completion status', this.userUpdated);
    this.estabRegistered = this.getStepCompletionStatus('III');
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

        // Check if stepper is available before accessing its properties
        if (this.stepper && this.stepper.steps && this.stepper.steps.length > 0) {
          console.debug(targetIndex, this.stepper.steps.length);
          if (targetIndex >= 0 && targetIndex < this.stepper.steps.length) {
            this.stepper.selectedIndex = targetIndex;
          }
        } else {
          // If stepper is not ready, defer the navigation
          setTimeout(() => {
            if (
              this.stepper &&
              this.stepper.steps &&
              targetIndex >= 0 &&
              targetIndex < this.stepper.steps.length
            ) {
              this.stepper.selectedIndex = targetIndex;
            }
          }, 0);
        }
      }
    } else {
      this.isLinear = true;
      // Check if stepper is available before accessing its properties
      if (this.stepper && this.stepper.steps && this.stepper.steps.length > 0) {
        const lastStepIndex = this.stepper.steps.length - 1;
        this.stepper.selectedIndex = Math.max(0, lastStepIndex);
      } else {
        // If stepper is not ready, defer the navigation
        setTimeout(() => {
          if (this.stepper && this.stepper.steps && this.stepper.steps.length > 0) {
            const lastStepIndex = this.stepper.steps.length - 1;
            this.stepper.selectedIndex = Math.max(0, lastStepIndex);
          }
        }, 0);
      }
    }
  }

  private loadStepData(stepCode: string): void {
    if (stepCode === 'III') {
      this.fetchEstabData();
    } else if (stepCode === 'IV') {
      this.fetchDocConfig();
    }
  }

  saveUser(): void {
    this.userSubmitted = true;
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData = {
        id: this.user.userId || 0,
        idCard: formValue.idCard || '',
        username: formValue.username || '',
        email: formValue.email || '',
        fullName: `${formValue.firstName || ''} ${formValue.lastName || ''}`.trim(),
        firstName: formValue.firstName || '',
        lastName: formValue.lastName || '',
        phoneNumber: formValue.phoneNumber || '',
        password: formValue.password || '',
        demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'II')?.id,
      };

      this._updateUserCustomerUseCase
        .execute(userData)
        .pipe(
          catchError((error: unknown) => {
            this._errorHandler.handleApiError(error, {
              operation: 'updating user',
              component: 'WizardConfigComponent',
            });
            return of(null);
          }),
        )
        .subscribe((response) => {
          if (response && isApiResponse(response)) {
            this._toasterService.show({
              type: response.code === '1' ? 'success' : 'warning',
              message:
                response.code === '1' ? 'Usuario actualizado exitosamente' : response.message,
            });
            if (response.code === '1') {
              this.userUpdated = true;
              this.fetchCompanyDemoSteps();
            }
          }
        });
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }
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

  trackByBodega(index: number): number {
    return index;
  }

  trackByPtoEmi(index: number): number {
    return index;
  }

  saveEstab(): void {
    if (this.bodegas.length > 0 && !this.bodegas.valid) {
      this.bodegas.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de las bodegas sean correctos',
      });
      return;
    }
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
      this.estabForm.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message:
          'Complete todos los campos requeridos del establecimiento y configuración de contribuyente',
      });
      return;
    }

    const telephone =
      this.telephones().length > 0 ? this.telephones().join(SEPARATOR_KEY_CODE.SLASH) : null;
    this.estabForm.get('telefono')?.setValue(telephone);

    const correo = this.emails().length > 0 ? this.emails().join(SEPARATOR_KEY_CODE.SLASH) : null;
    this.estabForm.get('correo')?.setValue(correo);

    const dataEstab = {
      ...this.estabForm.value,
      ptosEmi: JSON.stringify(this.estabForm.get('ptosEmi')?.value),
      bodegas: JSON.stringify(this.estabForm.get('bodegas')?.value),
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

    if (docs.length === 0) {
      this._toasterService.show({
        type: 'warning',
        message: 'No hay documentos configurados para guardar',
      });
      return;
    }

    const docConfigData = {
      docs,
      demoStepId: this.demoSteps().find((step: DemoStep) => step.code === 'IV')?.id,
    };

    this._createDocConfigUseCase
      .execute(docConfigData)
      .pipe(
        catchError((error: unknown) => {
          this._errorHandler.handleApiError(error, {
            operation: 'saving documents configuration',
            component: 'WizardConfigComponent',
          });
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response && isApiResponse(response)) {
          this._toasterService.show({
            type: response.code === '1' ? 'success' : 'warning',
            message:
              response.code === '1'
                ? `${docs.length} documentos guardados exitosamente`
                : response.message,
          });
          if (response.code === '1') {
            this.docsUpdated = true;
            this.fetchCompanyDemoSteps();
          }
        }
      });
  }

  saveCertificate(): void {
    if (this.certificateForm.valid && this.selectedFile) {
      const signatureData: ElectronicSignatureParam = {
        idFirmaElectronica: 0,
        contrasenia: this.certificateForm.get('contrasenia')?.value || '',
        file: this.selectedFile,
      };

      this._electronicSignatureHttp
        .save(signatureData)
        .pipe(
          catchError((error: unknown) => {
            this._errorHandler.handleApiError(error, {
              operation: 'saving electronic signature',
              component: 'WizardConfigComponent',
            });
            return of(null);
          }),
        )
        .subscribe((response) => {
          if (response && isApiResponse(response)) {
            this._toasterService.show({
              type: response.code === '1' ? 'success' : 'warning',
              message:
                response.code === '1' ? 'Certificado guardado exitosamente' : response.message,
            });
            if (response.code === '1') {
              this.certificateUpdated = true;
              this.fetchCompanyDemoSteps();
            }
          }
        });
    } else {
      this._toasterService.show({
        type: 'warning',
        message: 'Complete todos los campos requeridos y seleccione un archivo de certificado',
      });
    }
  }

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

  onActividadEconomicaChange(actividadCodigo: string | number | null): void {
    if (actividadCodigo) {
      this.estabForm.get('actividad')?.setValue(actividadCodigo.toString());
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

  trackByStep(_: number, step: DemoStep): string {
    return step.code;
  }

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
