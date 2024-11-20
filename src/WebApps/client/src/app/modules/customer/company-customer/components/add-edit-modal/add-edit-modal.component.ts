import { Component, inject, Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  NgbActiveModal,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CompanyCustomerService } from '../../company-customer.service';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { SriCustomerService } from '@modules/customer/sri-customer/services/sri-customer.service';
import { forkJoin, Observable } from 'rxjs';
import { SRI_IDENTIFICATION_CODE } from '@core/constants/global.constants';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-add-edit-modal',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbNavModule,
        FontAwesomeModule,
        NgbTooltipModule,
        MatChipGrid,
        MatChipRow,
        MatIcon,
        MatChipInput,
    ],
    templateUrl: './add-edit-modal.component.html',
    styles: ``
})
export class AddEditModalComponent {
  @Input() params = {
    id: 0,
  };

  // data = signal({
  //   direccion:null,
  //   idCargo: 0,
  //   idCliente: 0,
  //   idEmpresa: 0,
  //   idTipoClienteProveedor: 0,
  //   idTipoIdentificacion: 0,
  //   idSubContribuyente: 0,
  //   idTiempoCredito: 0,
  //   nombreFiscal: null as string | null,
  //   nombreComercial: null as string | null,
  //   numeroIdentificacion: null as string | null,
  //   correo: '',
  //   telefono: '',
  //   estado: false,
  //   validationSri: false,
  // })
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  activeTab = 1;
  addOnBlur = true;
  cargos: any = [];
  emails: string[] = [];
  empresas: any = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nuevo Cliente';
  numeroIdentificacion = new FormControl({ value: '', disabled: false }, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(15),
  ]);
  telephones: string[] = [];
  tiemposCredito: any[] = [];
  tipoContribuyentes: any[] = [];
  tiposCliente: any[] = [];
  tiposIdentificacion: any[] = [];
  barcodeCard = '';
  customerForm = new FormGroup({
    direccion: new FormControl('', Validators.required),
    idCargo: new FormControl(0),
    idCliente: new FormControl(0),
    idEmpresa: new FormControl(0),
    idTipoClienteProveedor: new FormControl(0),
    idTipoIdentificacion: new FormControl(0, Validators.required),
    idSubContribuyente: new FormControl(0),
    idTiempoCredito: new FormControl(0),
    nombreFiscal: new FormControl('', Validators.required),
    nombreComercial: new FormControl(''),
    numeroIdentificacion: this.numeroIdentificacion,
    correo: new FormControl(''),
    telefono: new FormControl(''),
    estado: new FormControl(false),
    validationSri: new FormControl(false),
  });
  private announcer = inject(LiveAnnouncer);
  private companyCustomerSvc = inject(CompanyCustomerService);
  private sriCustomerService = inject(SriCustomerService);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.push(value);
    }
    event.chipInput!.clear();
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.telephones.push(value);
    }
    event.chipInput!.clear();
  }

  copyTradeName() {}

  editEmail(fruit: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(fruit);
      return;
    }
    const index = this.emails.indexOf(fruit);
    if (index >= 0) {
      this.emails[index] = value;
    }
  }

  editTelephone(fruit: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(fruit);
      return;
    }
    const index = this.telephones.indexOf(fruit);
    if (index >= 0) {
      this.telephones[index] = value;
    }
  }

  async getCustomer(codigo: string, id: string) {
    let exists = false;
    //check if exists for company
    (
      await //check if exists for company
      this.companyCustomerSvc.checkExistence({ textSearch: id })
    ).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.tS.toastr({
              type: 'warning',
              message: 'El cliente ya se encuentra registrado en su empresa',
            });
            this.customerForm.patchValue({ numeroIdentificacion: '' });
            exists = true;
          }
        }
      },
    });

    if (!exists) {
      //search in global customers or in sri
      (
        await //search in global customers or in sri
        this.sriCustomerService.get(codigo, id)
      ).subscribe({
        next: (response: any) => {
          if (response.error) {
            this.tS.toastr({
              type: 'info',
              message: response.error,
            });
            return;
          }

          if (response.telefono) {
            if (response.telefono.includes(';')) {
              this.telephones = response.telefono.split(';');
            } else {
              this.telephones = response.telefono.split('|');
            }
          }
          if (response.email) {
            if (response.email.includes('|')) {
              this.emails = response.email.split('|') || [];
            } else {
              this.emails = response.email.split(';') || [];
            }
          }

          if (codigo == SRI_IDENTIFICATION_CODE.RUC) {
            if (response.numeroRuc) {
              this.customerForm.patchValue({
                numeroIdentificacion: response.numeroRuc,
                nombreFiscal: response.razonSocial,
                validationSri: true,
                direccion: response.direccion,
                nombreComercial: response.razonSocial,
              });
            }
          } else {
            if (response.identificacion) {
              this.customerForm.patchValue({
                numeroIdentificacion: response.identificacion,
                nombreFiscal: response.nombreCompleto,
                nombreComercial: response.nombreCompleto,
                direccion: response.direccion,
                validationSri: true,
              });
            }
          }
        },
      });
    }
  }

  getLoadData(): Observable<any> {
    if (this.params.id > 0) {
      return forkJoin([
        this.companyCustomerSvc.getDataForm(),
        this.companyCustomerSvc.getId(this.params.id),
      ]);
    } else {
    }
    return this.companyCustomerSvc.getDataForm();
  }

  ngOnInit(): void {
    try {
      this.getLoadData().subscribe((response) => {
        let mainDataForm = {} as any;
        let dataCompanyCustomer = {} as any;
        if (Array.isArray(response)) {
          mainDataForm = response[0];
          dataCompanyCustomer = response[1];
        } else {
          mainDataForm = response;
        }

        this.tiposIdentificacion = mainDataForm.tipoIdentificacion;
        this.tiemposCredito = mainDataForm.tiempoCreditos;

        if (!(this.params.id > 0)) {
          let dataIdentificacion = this.tiposIdentificacion.find(
            (ti: any) => ti.codigoSri === SRI_IDENTIFICATION_CODE.RUC,
          );

          if (dataIdentificacion) {
            this.customerForm.patchValue({
              idTipoIdentificacion: dataIdentificacion.idTipoIdentificacion,
            });
          }

          this.customerForm.patchValue({
            idTiempoCredito:
              this.tiemposCredito.length > 0
                ? this.tiemposCredito[0].idTiempoCredito
                : 0,
          });
        } else {
          this.modalIcon = 'edit';
          this.modalTitle = 'Editar Cliente';
          this.emails = dataCompanyCustomer.correos;
          this.telephones = dataCompanyCustomer.telefonos;
          this.customerForm.patchValue(response[1]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onModalClose() {
    this.modalRef.close();
  }

  onChangeTipoIdentificacion() {
    this.customerForm.patchValue({ numeroIdentificacion: '' });
  }

  async onKeyDownGovernmentId() {
    const dataForm = {
      ...this.customerForm.value,
    };
    let codigoSri = this.tiposIdentificacion.find(
      (x: any) => x.idTipoIdentificacion == dataForm.idTipoIdentificacion,
    ).codigoSri;
    if (
      codigoSri == SRI_IDENTIFICATION_CODE.RUC ||
      codigoSri == SRI_IDENTIFICATION_CODE.CEDULA
    ) {
      if (
        codigoSri === SRI_IDENTIFICATION_CODE.RUC &&
        dataForm.numeroIdentificacion
      ) {
        if (dataForm.numeroIdentificacion?.length != 13) {
          this.tS.toastr({
            type: 'warning',
            message: 'El número del ruc debe tener 13 dígitos',
          });
        }
        this.getCustomer(codigoSri, dataForm.numeroIdentificacion);
      }
      if (
        codigoSri === SRI_IDENTIFICATION_CODE.CEDULA &&
        dataForm.numeroIdentificacion
      ) {
        if (dataForm.numeroIdentificacion?.length != 10) {
          this.tS.toastr({
            type: 'warning',
            message: 'El número de la cédula debe tener 10 dígitos',
          });
        }
        this.getCustomer(codigoSri, dataForm.numeroIdentificacion);
      }
    }
  }

  onSave() {
    console.log(this.telephones);

    this.customerForm.patchValue({
      telefono: this.telephones.length > 0 ? this.telephones.join('|') : null,
    });

    this.customerForm.patchValue({
      correo: this.emails.length > 0 ? this.emails.join('|') : null,
    });
    const dataForm = {
      ...this.customerForm.value,
    };
    console.log(dataForm);
    if (this.params.id > 0) {
      this.companyCustomerSvc
        .put(this.params.id, dataForm)
        .subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.modalRef.close({
                id: this.params.id,
              });
            }
          }
        });
    } else if (!(this.params.id > 0)) {
      this.companyCustomerSvc.post(dataForm).subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            let data = {
              id: (response.payload as any).id,
            };
            this.modalRef.close(data);
          }
        }
      });
    }
  }

  refreshTiempoCredito() {}

  removeEmail(email: string): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
      this.announcer.announce(`Removed ${email}`);
    }
  }

  removeTelephone(telephone: string): void {
    const index = this.telephones.indexOf(telephone);
    if (index >= 0) {
      this.telephones.splice(index, 1);
      this.announcer.announce(`Removed ${telephone}`);
    }
  }
}
