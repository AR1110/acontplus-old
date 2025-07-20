// ============================================================================
// IMPORTS
// ============================================================================

// Angular Core
import { Component, inject, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
import { RouterModule } from '@angular/router';

// Third-party Libraries
import Swal from 'sweetalert2';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Core Components & Services
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse, ApiResponse } from '@core/models/api-response';
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

// Step Components
import { UserStepComponent } from './components/user-step/user-step.component';
import { EstablishmentStepComponent } from './components/establishment-step/establishment-step.component';

// Module Services
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { FirmaElectronicaService } from '@modules/config/services/firma-electronica.service';
import { WizardErrorHandlerService } from './services/wizard-error-handler.service';

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

// Store
import { WizardConfigStore } from '@modules/config/application/store/wizard-config.store';

// Utilities
import { romanToInt } from '@modules/config/domain/models/wizard-config/roman-to-index';

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

// Form Control Interfaces for Typed Forms
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

    // Step Components
    UserStepComponent,
    EstablishmentStepComponent,

    // Router
    RouterModule,
  ],
  templateUrl: './wizard-config.component.html',
  styles: [],
})
export class WizardConfigComponent implements OnInit {
  // ============================================================================
  // VIEW CHILD & INJECTIONS
  // ============================================================================

  @ViewChild('stepper') stepper!: MatStepper;

  // Store Injection
  readonly wizardStore = inject(WizardConfigStore);

  // Service Injections
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly _toasterService = inject(ToastrNotificationService);
  private readonly _estabService = inject(EstablishmentService);
  private readonly _firmaElectronicaService = inject(FirmaElectronicaService);
  private readonly _companyDemoStepService = inject(CompanyDemoStepService);
  private readonly _createDocConfigUseCase = inject(CreateDocConfigUseCase);
  private readonly _formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly _updateUserCustomerUseCase = inject(UpdateUserCustomerUseCase);
  private readonly _errorHandler = inject(WizardErrorHandlerService);

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
      editable: function (cell: TabulatorCell): boolean {
        return cell.getRow().getTreeParent() ? true : false;
      },
      validator: function (cell: TabulatorCell, value: unknown): boolean | TabulatorValidatorResult {
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
  // FORM DEFINITIONS
  // ============================================================================

  certificateForm = this.wizardStore.createCertificateForm();
  estabForm = this.wizardStore.createEstabForm();
  userForm = this.wizardStore.createUserForm();
  tipoContribuyenteForm = this.wizardStore.createTipoContribuyenteForm();

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
    this.wizardStore.loadCompanyDemoSteps();
  }

  // ============================================================================
  // FORM ARRAY MANAGEMENT METHODS
  // ============================================================================

  newBodega(): FormGroup {
    return this.wizardStore.createBodegaForm();
  }

  newPtoEmi(): FormGroup {
    return this.wizardStore.createPtoEmiForm();
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

  // ============================================================================
  // CHIP MANAGEMENT METHODS
  // ============================================================================

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.wizardStore.addEmail(value);
      event.chipInput!.clear();
    }
  }

  removeEmail(value: string): void {
    this.wizardStore.removeEmail(value);
    this._announcer.announce(`Removed ${value}`);
  }

  editEmail(email: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(email);
    } else {
      this.wizardStore.removeEmail(email);
      this.wizardStore.addEmail(value);
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.wizardStore.addTelephone(value);
      event.chipInput!.clear();
    }
  }

  removeTelephone(value: string): void {
    this.wizardStore.removeTelephone(value);
    this._announcer.announce(`Removed ${value}`);
  }

  editTelephone(telephone: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeTelephone(telephone);
    } else {
      this.wizardStore.removeTelephone(telephone);
      this.wizardStore.addTelephone(value);
    }
  }

  // ============================================================================
  // VALIDATION METHODS
  // ============================================================================

  private validateBodegas(): boolean {
    if (this.bodegas.length === 0) return true;

          for (let i = 0; i < this.bodegas.length; i++) {
        const bodega = this.bodegas.at(i) as FormGroup;
        if (!bodega.valid) {
          this._toasterService.show({
            type: 'error',
            message: `Bodega ${i + 1} tiene errores de validación`
          });
          return false;
        }
      }
    return true;
  }

  private validatePuntosEmision(): boolean {
    if (this.ptosEmi.length === 0) {
      this._toasterService.show({
        type: 'error',
        message: 'Debe agregar al menos un punto de emisión'
      });
      return false;
    }

    for (let i = 0; i < this.ptosEmi.length; i++) {
      const ptoEmi = this.ptosEmi.at(i) as FormGroup;
      if (!ptoEmi.valid) {
        this._toasterService.show({
          type: 'error',
          message: `Punto de emisión ${i + 1} tiene errores de validación`
        });
        return false;
      }
    }
    return true;
  }

  private validateDocumentos(): boolean {
    const docsConfig = this.wizardStore.docsConfig();
    if (docsConfig.length === 0) {
      this._toasterService.show({
        type: 'error',
        message: 'No hay documentos configurados'
      });
      return false;
    }

    for (const estab of docsConfig) {
      if (estab._children && estab._children.length > 0) {
        for (const doc of estab._children) {
          if (doc.ultimaSecuencia < 0) {
            this._toasterService.show({
              type: 'error',
              message: `Secuencia inválida para documento ${doc.descripcion}`
            });
            return false;
          }
        }
      }
    }
    return true;
  }

  // ============================================================================
  // SAVE METHODS
  // ============================================================================

  saveEstab(): void {
    if (!this.estabForm.valid) {
      this._toasterService.show({
        type: 'error',
        message: 'El formulario tiene errores de validación'
      });
      return;
    }

    if (!this.validateBodegas() || !this.validatePuntosEmision()) {
      return;
    }

    // Implementation for saving establishment
    this.wizardStore.markEstabStepCompleted();
    this._toasterService.show({
      type: 'success',
      message: 'Establecimiento guardado exitosamente'
    });
  }

  saveUser(): void {
    if (!this.userForm.valid) {
      this._toasterService.show({
        type: 'error',
        message: 'El formulario tiene errores de validación'
      });
      return;
    }

    // Implementation for saving user
    this.wizardStore.markUserStepCompleted();
    this._toasterService.show({
      type: 'success',
      message: 'Usuario guardado exitosamente'
    });
  }

  saveDocs(): void {
    if (!this.validateDocumentos()) {
      return;
    }

    // Implementation for saving documents
    this.wizardStore.markDocsStepCompleted();
    this._toasterService.show({
      type: 'success',
      message: 'Documentos guardados exitosamente'
    });
  }

  saveCertificate(): void {
    if (!this.certificateForm.valid) {
      this._toasterService.show({
        type: 'error',
        message: 'El formulario tiene errores de validación'
      });
      return;
    }

    if (!this.wizardStore.selectedFile()) {
      this._toasterService.show({
        type: 'error',
        message: 'Debe seleccionar un archivo de firma'
      });
      return;
    }

    // Implementation for saving certificate
    this.wizardStore.markCertificateStepCompleted();
    this._toasterService.show({
      type: 'success',
      message: 'Certificado guardado exitosamente'
    });
  }

  saveTipoContribuyente(): void {
    if (!this.tipoContribuyenteForm.valid) {
      this._toasterService.show({
        type: 'error',
        message: 'El formulario tiene errores de validación'
      });
      return;
    }

    // Implementation for saving contribuyente type
    this.wizardStore.markContribuyenteStepCompleted();
    this._toasterService.show({
      type: 'success',
      message: 'Tipo de contribuyente guardado exitosamente'
    });
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  onChangeTipoContribuyente(): void {
    // Implementation for handling contribuyente type change
  }

  onFileChange(event: FileChangeEvent): void {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/x-pkcs12') {
      this.wizardStore.setSelectedFile(file);
      this.wizardStore.setFileError(false);
    } else {
      this.wizardStore.setSelectedFile(null);
      this.wizardStore.setFileError(true);
    }
  }

  showInfoTipoContribuyente(): void {
    // Implementation for showing contribuyente info
  }

  showInfoActividadEconomica(): void {
    // Implementation for showing actividad economica info
  }

  // ============================================================================
  // TRACK BY FUNCTIONS
  // ============================================================================

  trackByStep(index: number, step: DemoStep): string {
    return step.code;
  }

  trackByEmail(index: number, email: string): string {
    return email;
  }

  trackByTelephone(index: number, telephone: string): string {
    return telephone;
  }

  trackByBodega(index: number): number {
    return index;
  }

  trackByPtoEmi(index: number): number {
    return index;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  skipAndFinish(): void {
    this.wizardStore.markCertificateStepCompleted();
    this._toasterService.show({
      type: 'info',
      message: 'Paso de certificado omitido'
    });
  }
}
