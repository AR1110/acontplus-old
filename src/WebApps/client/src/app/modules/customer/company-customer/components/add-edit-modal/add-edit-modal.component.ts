import { Component, inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MaterialModule } from '@core/material/material.module';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CompanyCustomerService } from '../../services/company-customer.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { SriCustomerService } from '@modules/customer/sri-customer/services/sri-customer.service';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [AppModule, MaterialModule, NgbTooltipModule],
  templateUrl: './add-edit-modal.component.html',
  styles: ``,
})
export class AddEditModalComponent {
  private announcer = inject(LiveAnnouncer);
  private companyCustomerService = inject(CompanyCustomerService);
  private sriCustomerService = inject(SriCustomerService);
  private modalRef = inject(NgbActiveModal);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private tS = inject(ToasterService);

  activeTab = 1;
  addOnBlur = true;
  cargos: any = [];
  data: any = {};
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
  tiempoCreditos: any = [];
  tipoContribuyentes: any = [];
  tiposCliente: any = [];
  tiposIdentificacion: any = [];

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

  get() {
    showLoader();
    this.companyCustomerService.getDataForm().subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          let tempArray = JSON.parse(response.payload as string);
          this.tiposIdentificacion = tempArray[0];
          this.customerForm.patchValue({
            idTipoIdentificacion:
              this.tiposIdentificacion[1].idTipoIdentificacion,
          });
        }
      },
      error(err) {
        hideLoader();
        console.log(err);
      },
      complete() {
        hideLoader();
      },
    });
  }

  async getCustomer(codigo: string, id: string) {
    showLoader();
    let exists = false;
    debugger;
    //check if exists for company
    (
      await //check if exists for company
      this.companyCustomerService.checkExistence({ textSearch: id })
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
      error(err) {
        hideLoader();
        console.error(err);
      },
      complete() {
        hideLoader();
      },
    });

    if (!exists) {
      //search in global customers or in sri
      (
        await //search in global customers or in sri
        this.sriCustomerService.get(codigo, id)
      ).subscribe({
        next: (response: any) => {
          if (codigo == '04') {
            if (response.numeroRuc) {
              this.customerForm.patchValue({
                numeroIdentificacion: response.numeroRuc,
                nombreFiscal: response.razonSocial,
                validationSri: true,
              });
            }
          } else {
            if (response.identificacion) {
              this.customerForm.patchValue({
                numeroIdentificacion: response.identificacion,
                nombreFiscal: response.nombreCompleto,
                direccion: response.direccion,
                validationSri: true,
              });
            }
          }
        },
        error(err) {
          hideLoader();
          console.error(err);
        },
        complete() {
          hideLoader();
        },
      });
    }
  }

  ngOnInit(): void {
    this.get();
    if (this.data.idCliente > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Cliente';
      if (this.data.correo) {
        let correos = this.data.correo.replace(/;/g, ',').split(',');
        for (const item of correos) {
          this.emails.push(item);
        }
      }
      if (this.data.telefono) {
        let telephones = this.data.telefono.replace(/;/g, ',').split(',');
        for (const item of telephones) {
          this.telephones.push(item);
        }
      }
      this.customerForm.patchValue(this.data);
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
      (x: any) => x.idTipoIdentificacion == dataForm.idTipoIdentificacion
    ).codigoSri;
    if (codigoSri == '04' || codigoSri == '05') {
      if (codigoSri === '04' && dataForm.numeroIdentificacion) {
        if (dataForm.numeroIdentificacion?.length != 13) {
          this.tS.toastr({
            type: 'warning',
            message: 'El número del ruc debe tener 13 dígitos',
          });
        }
        this.getCustomer(codigoSri, dataForm.numeroIdentificacion);
      }
      if (codigoSri === '05' && dataForm.numeroIdentificacion) {
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
    showLoader();
    if (this.telephones.length > 0) {
      this.customerForm.patchValue({
        telefono: new Array(this.telephones).toString().split(',').join(';'),
      });
    }
    if (this.emails.length > 0) {
      this.customerForm.patchValue({
        correo: new Array(this.emails).toString().split(',').join(';'),
      });
    }
    const dataForm = {
      ...this.customerForm.value,
    };
    console.log(dataForm);
    if (dataForm.idCliente || 0 > 0) {
      this.companyCustomerService.put(this.data.idCliente, dataForm).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.onModalClose();
            }
          }
        },
        error(err) {
          hideLoader();
          console.log(err);
        },
        complete() {
          hideLoader();
        },
      });
    } else {
      this.companyCustomerService.post(dataForm).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.modalRef.close(response);
            }
          }
        },
        error(err) {
          hideLoader();
          console.log(err);
        },
        complete() {
          hideLoader();
        },
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
