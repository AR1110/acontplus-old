import { Component, inject, ViewChild } from '@angular/core';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { UserCustomerService } from '@modules/config/services/user-customer/user-customer.service';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { AuthService, UserData } from '@modules/auth/services/auth.service';
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { DemoStep } from '@modules/config/models/wizard-config/demo-step.model';
import { romanToInt } from '@modules/config/models/wizard-config/roman-to-index';
import { EstabAddEditModalComponent } from '../establishment-page/components/estab-add-edit-modal/estab-add-edit-modal.component';
import { EstablishmentPageComponent } from '../establishment-page/establishment-page.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import Swal from 'sweetalert2';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AmbienteSri, ambienteSriOptions } from '@shared/models/ambiente-sri';

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
  ],
  templateUrl: './wizard-config.component.html',
  styles: ``,
})
export class WizardConfigComponent {
  @ViewChild('stepper')
  stepper!: MatStepper;
  addOnBlur: boolean = true;
  announcer = inject(LiveAnnouncer);
  cantones: any[] = [];
  actividadesEconomica: any[] = [];
  agentesRetencion: any[] = [];
  contribuyentes: any[] = [];
  isLinear = false;
  isDisabledAgenteRetencion = false;
  emails: string[] = [];
  telephones: string[] = [];
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
  ambientes: AmbienteSri[] = [];

  demoSteps: DemoStep[] = [];
  user = {} as UserData;
  userUpdated: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  #fb = inject(FormBuilder);
  estabForm = this.#fb.group({
    canton: new FormControl(''),
    actividad: new FormControl('', [Validators.required]),
    agenteRetencion: new FormControl(''),
    contribuyente: new FormControl('', [Validators.required]),
    contribuyenteEspecial: new FormControl('', [Validators.required]),
    estab: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    obligadoContabilidad: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
    nombreComercial: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(300),
    ]),
    dirEstablecimiento: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
    ]),
    telefono: new FormControl(''),
    correo: new FormControl(''),
    ptosEmi: this.#fb.array([]),
  });
  #companyDemoStepService = inject(CompanyDemoStepService);
  #authSvc = inject(AuthService);
  #tS = inject(ToasterService);
  #userService = inject(UserCustomerService);
  #estabService = inject(EstablishmentService);

  get ptosEmi(): FormArray {
    return this.estabForm.get('ptosEmi') as FormArray;
  }

  getCompanyDemoSteps() {
    this.#companyDemoStepService.get({}).subscribe((response) => {
      if (response.code == '1') {
        let tempArray = JSON.parse(response.payload as string);
        this.demoSteps = tempArray['companyDemoSteps'] as DemoStep[];
        this.userUpdated =
          this.demoSteps.find((x) => x.code == 'IV')?.completed || false;

        const incompleteStep = this.demoSteps.find((step) => !step.completed);
        const stepIndex = incompleteStep
          ? romanToInt(incompleteStep.code)
          : null;
        if (stepIndex !== null) {
          if (incompleteStep?.code === 'V') {
            this.getEstabData();
          }
          this.stepper.selectedIndex = stepIndex - 1; // Adjust for zero-based index
        }
      }
    });
  }

  newPtoEmi(): FormGroup {
    return this.#fb.group({
      ptoEmi: '',
      ambiente: '',
    });
  }

  addPtoEmi() {
    this.ptosEmi.push(this.newPtoEmi());
  }

  removePtoEmi(i: number) {
    this.ptosEmi.removeAt(i);
  }

  getEstabData() {
    this.#estabService.getDataForm().subscribe((response) => {
      const {
        cantones,
        actividadesEconomica,
        agentesRetencion,
        contribuyentes,
        ambientes,
      } = response;
      this.cantones = cantones;
      this.actividadesEconomica = actividadesEconomica;
      this.agentesRetencion = agentesRetencion;
      this.contribuyentes = contribuyentes;
      //this.ambientes = ambientes;
    });
  }

  ngOnInit(): void {
    const decodedToken = this.#authSvc.getDecodedToken();
    if (decodedToken) {
      this.user = decodedToken;
    }
    this.getCompanyDemoSteps();
    this.ambientes = ambienteSriOptions;
  }

  saveEstab() {
    const dataEstab = {
      ...this.estabForm.value,
    };
    console.log(dataEstab);
  }

  saveUser() {
    const userData = {
      ...this.userForm.value,
      email: this.user.email,
      username: this.user.username,
      demoStepId: this.demoSteps.find((x) => x.code == 'IV')?.id,
    };
    this.#userService.put(this.user.userId, userData).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code == '0' && this.stepper) {
          this.stepper.previous();
        }
        if (response.code === '1') {
          this.userUpdated = true;
          this.getCompanyDemoSteps();
          this.getEstabData();
        }
        this.#tS.toastr({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
      }
    });
  }

  onChangeTipoContribuyente() {
    this.isDisabledAgenteRetencion =
      this.estabForm.get('contribuyente')?.value == '03';
    if (this.isDisabledAgenteRetencion) {
      this.estabForm.get('agenteRetencion')?.setValue(null);
    }
  }

  showInfoTipoContribuyente() {
    const dataInfo = this.contribuyentes.find(
      (item) => item.codigo === this.estabForm.get('contribuyente')?.value,
    );
    if (
      !this.estabForm.get('contribuyente')?.value ||
      !dataInfo.contribuyenteRimpe
    )
      return;

    Swal.fire({
      icon: 'info',
      html: `<small>${dataInfo.contribuyenteRimpe}</small>`,
    });
  }

  showInfoActividadEconomica() {
    if (!this.estabForm.get('actividad')?.value) return;
    const groupActEconomica = this.actividadesEconomica.find(
      (item) => item.codigo === this.estabForm.get('actividad')?.value,
    ).grupo;
    Swal.fire({
      icon: 'info',
      html: `<small>${groupActEconomica}</small>`,
    });
  }

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeEmail(value: string): void {
    const index = this.emails.indexOf(value);

    if (index >= 0) {
      this.emails.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  editEmail(email: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove email if it no longer has a name
    if (!value) {
      this.removeEmail(email);
      return;
    }

    // Edit existing email
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails[index] = value;
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.telephones.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTelephone(value: string): void {
    const index = this.telephones.indexOf(value);

    if (index >= 0) {
      this.telephones.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  editTelephone(telefono: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.removeTelephone(telefono);
      return;
    }

    // Edit existing fruit
    const index = this.telephones.indexOf(telefono);
    if (index >= 0) {
      this.telephones[index] = value;
    }
  }
}
