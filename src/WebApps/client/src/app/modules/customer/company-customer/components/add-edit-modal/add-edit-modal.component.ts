import { Component, OnInit, inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
export class AddEditModalComponent implements OnInit {
  private announcer = inject(LiveAnnouncer);
  private companyCustomerService = inject(CompanyCustomerService);
  private sriCustomerService = inject(SriCustomerService);
  private fb = inject(FormBuilder);
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

  customerForm = this.fb.group({
    direccion: ['', Validators.required],
    idCargo: 0,
    idCliente: 0,
    idEmpresa: 0,
    idTipoClienteProveedor: 0,
    idTipoIdentificacion: [Validators.required],
    idSubContribuyente: 0,
    idTiempoCredito: 0,
    nombreFiscal: ['', Validators.required],
    nombreComercial: [''],
    numeroIdentificacion: this.numeroIdentificacion,
  });

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.push(value);
    }
    event.chipInput!.clear();
  }
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
  removeEmail(telephone: string): void {
    const index = this.telephones.indexOf(telephone);
    if (index >= 0) {
      this.telephones.splice(index, 1);
      this.announcer.announce(`Removed ${telephone}`);
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.telephones.push(value);
    }
    event.chipInput!.clear();
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
  removeTelephone(telephone: string): void {
    const index = this.telephones.indexOf(telephone);
    if (index >= 0) {
      this.telephones.splice(index, 1);
      this.announcer.announce(`Removed ${telephone}`);
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  copyTradeName() {}

  get() {
    showLoader();
    const self = this;
    this.companyCustomerService.getDataForm().subscribe({
      next(response) {
        if (isApiResponse(response)) {
          let tempArray = JSON.parse(response.payload as string);
          self.tiposIdentificacion = tempArray[0];
          self.customerForm.patchValue({
            idTipoIdentificacion:
              self.tiposIdentificacion[1].idTipoIdentificacion,
          });
          console.log(tempArray);
        }
      },
      complete() {
        hideLoader();
      },
      error(err) {
        hideLoader();
        console.log(err);
      },
    });
  }

  async getCustomer(codigo: string, id: string) {
    const self = this;
    let exists = false;
    debugger;
    //check if exists for company
    (
      await //check if exists for company
      this.companyCustomerService.checkExistence({ textSearch: id })
    ).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            self.tS.toastr({
              type: 'warning',
              message: 'El cliente ya se encuentra registrado en su empresa',
            });
            self.customerForm.patchValue({ numeroIdentificacion: '' });
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
        next(response: any) {
          if (codigo == '04') {
            if (response.numeroRuc) {
              self.customerForm.patchValue({
                numeroIdentificacion: response.numeroRuc,
                nombreFiscal: response.razonSocial,
              });
            }
          } else {
            if (response.identificacion) {
              self.customerForm.patchValue({
                numeroIdentificacion: response.identificacion,
                nombreFiscal: response.nombreCompleto,
                direccion: response.direccion,
              });
            }
          }
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
        let correos = this.data.correo.split(';');
        for (const item of correos) {
          this.emails.push(item);
        }
      }
      if (this.data.telefono) {
        let telephones = this.data.telefono.split(';');
        for (const item of telephones) {
          this.telephones.push(item);
        }
      }
      this.customerForm.patchValue(this.data);
    }
  }

  onChangeTipoIdentificacion() {
    this.customerForm.patchValue({ numeroIdentificacion: '' });
  }

  refreshTiempoCredito() {}

  save() {
    showLoader();
    const self = this;
    const dataForm = {
      ...this.customerForm.value,
    };
    console.log(dataForm);

    if (dataForm.idCliente || 0 > 0) {
      this.companyCustomerService.put(this.data.idCliente, dataForm).subscribe({
        next(response) {
          if (isApiResponse(response)) {
            if (response.code == '0') {
              self.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              self.tS.toastr({
                type: 'success',
                message: response.message,
              });
            }
          }
        },
        complete() {
          hideLoader();
        },
        error(err) {
          hideLoader();
          console.log(err);
        },
      });
    } else {
      this.companyCustomerService.post(dataForm).subscribe({
        next(response) {
          if (isApiResponse(response)) {
            if (response.code == '0') {
              self.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              self.tS.toastr({
                type: 'success',
                message: response.message,
              });
            }
          }
        },
        complete() {
          hideLoader();
        },
        error(err) {
          hideLoader();
          console.log(err);
        },
      });
    }
  }

  async validarNumeroIdentificacion() {
    const self = this;
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
}
