import { Component, inject, ViewChild } from '@angular/core';
import { BACKSLASH, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { AmbienteSri, ambienteSriOptions } from '@shared/models/ambiente-sri';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService, UserData } from '@modules/auth/services/auth.service';
import { UserCustomerService } from '@modules/config/services/user-customer/user-customer.service';
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { DemoStep } from '@modules/config/models/wizard-config/demo-step.model';
import { romanToInt } from '@modules/config/models/wizard-config/roman-to-index';
import { EstabAddEditModalComponent } from '../establishment-page/components/estab-add-edit-modal/estab-add-edit-modal.component';
import { EstablishmentPageComponent } from '../establishment-page/establishment-page.component';
import Swal from 'sweetalert2';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { DocConfigService } from '@modules/config/services/doc-config.service';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { DocConfig } from '@modules/config/models/doc-config.model';
import { TabulatorSemanticUiComponent } from '../../../../core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';

@Component({
  selector: 'app-wizard-config',
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    BreadcrumbComponent,
    ReactiveFormsModule,
    MatStepLabel,
    MatButton,
    MatStepperNext,
    MatStepperPrevious,
    MatCard,
    MatCardContent,
    EstabAddEditModalComponent,
    EstablishmentPageComponent,
    FaIconComponent,
    MatRadioButton,
    NgbTooltip,
    MatChipGrid,
    MatChipRow,
    MatChipInput,
    MatRadioGroup,
    ToUpperCaseDirective,
    TabulatorSemanticUiComponent,
  ],
  templateUrl: './wizard-config.component.html',
  styles: [],
})
export class WizardConfigComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  addOnBlur = true;
  announcer = inject(LiveAnnouncer);
  cantones: any[] = [];
  columnNames = [
    { title: 'idPuntoEmision', field: 'idPuntoEmision', visible: false },
    { title: 'Pto. Emi', field: 'ptoEmi' },
    { title: 'idTipoDocumento', field: 'idTipoDocumento', visible: false },
    { title: 'descripcion', field: 'descripcion', width: 200 },
    { title: 'ultimaSecuencia', field: 'ultimaSecuencia', editor: true },
  ];
  docsConfig = [];
  actividadesEconomica: any[] = [];
  agentesRetencion: any[] = [];
  contribuyentes: any[] = [];
  ambientes: AmbienteSri[] = ambienteSriOptions;
  isLinear = false;
  isDisabledAgenteRetencion = false;
  emails: string[] = [];
  telephones: string[] = [];
  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  docs: Array<DocConfig> = [];
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
  demoSteps: DemoStep[] = [];
  user: UserData = {} as UserData;
  userUpdated: boolean = false;
  estabRegistered: boolean = false;
  readonly separatorKeysCodes = [ENTER, BACKSLASH] as const;
  #authSvc = inject(AuthService);
  #toasterService = inject(ToasterService);
  #userService = inject(UserCustomerService);
  #estabService = inject(EstablishmentService);
  #fb = inject(FormBuilder);
  estabForm = this.#fb.group({
    canton: '',
    actividad: ['', Validators.required],
    agenteRetencion: '',
    contribuyente: ['', Validators.required],
    contribuyenteEspecial: [''],
    estab: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    ],
    obligadoContabilidad: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
    ],
    nombreComercial: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(300)],
    ],
    dirEstablecimiento: ['', [Validators.required, Validators.maxLength(300)]],
    telefono: [''],
    correo: [''],
    ptosEmi: this.#fb.array([]),
    hasInventory: [false],
    bodegas: this.#fb.array([]),
  });
  #docConfigSvc = inject(DocConfigService);
  #companyDemoStepService = inject(CompanyDemoStepService);

  get bodegas(): FormArray {
    return this.estabForm.get('bodegas') as FormArray;
  }

  get ptosEmi(): FormArray {
    return this.estabForm.get('ptosEmi') as FormArray;
  }

  newBodega(): FormGroup {
    return this.#fb.group({
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

  addBodega(): void {
    this.bodegas.push(this.newBodega());
  }

  removeBodega(index: number): void {
    this.bodegas.removeAt(index);
  }

  newPtoEmi(): FormGroup {
    return this.#fb.group({
      ptoEmi: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      ambiente: ['', Validators.required],
    });
  }

  addPtoEmi(): void {
    this.ptosEmi.push(this.newPtoEmi());
  }

  removePtoEmi(index: number): void {
    this.ptosEmi.removeAt(index);
  }

  ngOnInit(): void {
    const decodedToken = this.#authSvc.getDecodedToken();
    if (decodedToken) {
      this.user = decodedToken;
    }
    this.fetchCompanyDemoSteps();
  }

  // createFormGroup(controlsConfig: any): FormGroup {
  //   return this.#fb.group(controlsConfig);
  // }

  fetchCompanyDemoSteps(): void {
    this.#companyDemoStepService.get({}).subscribe((response) => {
      if (response.code === '1') {
        const tempArray = JSON.parse(response.payload as string);
        this.demoSteps = tempArray['companyDemoSteps'] as DemoStep[];
        this.userUpdated =
          this.demoSteps.find((step) => step.code === 'IV')?.completed ?? false;
        this.estabRegistered =
          this.demoSteps.find((step) => step.code === 'V')?.completed ?? false;

        const incompleteStep = this.demoSteps.find((step) => !step.completed);
        const stepIndex = incompleteStep
          ? romanToInt(incompleteStep.code)
          : null;
        if (stepIndex !== null) {
          if (incompleteStep?.code === 'V') {
            this.fetchEstabData();
          }
          if (incompleteStep?.code === 'VI') {
            this.fetchDocConfig();
          }
          this.stepper.selectedIndex = stepIndex - 1; // Adjust for zero-based index
        }
      }
    });
  }

  fetchDocConfig() {
    this.#docConfigSvc.getDataForm().subscribe((response) => {
      console.log(response);
      this.establecimientos = response.establecimientos;
      const combinedData = this.establecimientos[0].puntosEmision.map(
        (pto) => ({
          ...pto,
          children: response.tiposDoc.map((doc: any) => ({
            ...doc,
            parentId: pto.idPuntoEmision,
          })),
        }),
      );
      this.docsConfig = combinedData as [];
      // let dataEstab = this.establecimientos.find((e) => e.defaultEstab);
      // if (dataEstab) {
      //   this.puntosEmision = dataEstab?.puntosEmision;
      //   // let dataPuntoEmision = this.puntosEmision.find((p) => p.defaultPtoEmi);
      //   // if (dataPuntoEmision) {
      //   //   this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
      //   //   this.getDocs();
      //   // }
      //   // this.dataSearch.codEstab = dataEstab?.codEstab;
      // }
    });
  }

  fetchEstabData(): void {
    this.#estabService.getDataForm().subscribe((response) => {
      this.cantones = response.cantones;
      this.actividadesEconomica = response.actividadesEconomica;
      this.agentesRetencion = response.agentesRetencion;
      this.contribuyentes = response.contribuyentes;
    });
  }

  saveEstab(): void {
    if (this.bodegas.length > 0 && !this.bodegas.valid) {
      this.bodegas.markAllAsTouched();
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      return this.#toasterService.toastr({
        type: 'warning',
        message: 'Revise que los datos de las bodegas sean correctos',
      });
    }
    if (this.ptosEmi.length === 0) {
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      return this.#toasterService.toastr({
        type: 'warning',
        message: 'Ingrese al menos un punto de emisión',
      });
    }

    if (!this.ptosEmi.valid) {
      this.stepper.selectedIndex = this.stepper.selectedIndex - 1;
      this.ptosEmi.markAllAsTouched();
      return this.#toasterService.toastr({
        type: 'warning',
        message: 'Revise que los datos de los puntos de emisión sean correctos',
      });
    }
    let telephone =
      this.telephones.length > 0
        ? this.telephones.join(SEPARATOR_KEY_CODE.SLASH)
        : null;

    this.estabForm.get('telefono')?.setValue(telephone);

    let correo =
      this.emails.length > 0
        ? this.emails.join(SEPARATOR_KEY_CODE.SLASH)
        : null;
    this.estabForm.get('correo')?.setValue(correo);

    const dataEstab = {
      ...this.estabForm.value,
      ptosEmi: JSON.stringify(this.estabForm.get('ptosEmi')?.value),
      bodegas: JSON.stringify(this.estabForm.get('bodegas')?.value),
      demoStepId: this.demoSteps.find((step) => step.code === 'V')?.id,
    };
    this.#estabService.post(dataEstab).subscribe((response) => {
      if (isApiResponse(response)) {
        this.#toasterService.toastr({
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
    const userData = {
      ...this.userForm.value,
      email: this.user.email,
      username: this.user.username,
      demoStepId: this.demoSteps.find((step) => step.code === 'IV')?.id,
    };
    this.#userService.put(this.user.userId, userData).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code === '0' && this.stepper) {
          this.stepper.previous();
        }
        if (response.code === '1') {
          this.userUpdated = true;
          this.fetchCompanyDemoSteps();
          this.fetchEstabData();
        }
        this.#toasterService.toastr({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
      }
    });
  }

  onChangeTipoContribuyente(): void {
    this.isDisabledAgenteRetencion =
      this.estabForm.get('contribuyente')?.value === '03';
    if (this.isDisabledAgenteRetencion) {
      this.estabForm.get('agenteRetencion')?.setValue(null);
    }
  }

  showInfoTipoContribuyente(): void {
    const contribuyente = this.estabForm.get('contribuyente')?.value;
    const dataInfo = this.contribuyentes.find(
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
    const actividad = this.estabForm.get('actividad')?.value;
    const groupActEconomica = this.actividadesEconomica.find(
      (item) => item.codigo === actividad,
    )?.grupo;
    if (actividad && groupActEconomica) {
      Swal.fire({
        icon: 'info',
        html: `<small>${groupActEconomica}</small>`,
      });
    }
  }

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.push(value);
      event.chipInput!.clear();
    }
  }

  removeEmail(value: string): void {
    const index = this.emails.indexOf(value);
    if (index >= 0) {
      this.emails.splice(index, 1);
      this.announcer.announce(`Removed ${value}`);
    }
  }

  editEmail(email: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(email);
    } else {
      const index = this.emails.indexOf(email);
      if (index >= 0) {
        this.emails[index] = value;
      }
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.telephones.push(value);
      event.chipInput!.clear();
    }
  }

  removeTelephone(value: string): void {
    const index = this.telephones.indexOf(value);
    if (index >= 0) {
      this.telephones.splice(index, 1);
      this.announcer.announce(`Removed ${value}`);
    }
  }

  editTelephone(telephone: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeTelephone(telephone);
    } else {
      const index = this.telephones.indexOf(telephone);
      if (index >= 0) {
        this.telephones[index] = value;
      }
    }
  }

  saveDocs() {}
}
