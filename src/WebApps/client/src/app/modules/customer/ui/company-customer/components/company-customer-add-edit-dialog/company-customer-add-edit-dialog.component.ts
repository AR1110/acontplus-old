import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {   MatTabsModule } from '@angular/material/tabs';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { M3InputChipComponent } from '@shared/components/m3-input-chip/m3-input-chip.component';
import {SEPARADORES_REGEX, SEPARATOR_KEY_CODE, SRI_IDENTIFICATION_CODE} from "@core/constants/global.constants";
import {forkJoin, Observable} from "rxjs";
import {ToasterService} from "@core/services/toaster.service";
import {CompanyCustomerUseCase} from "@customer/core/usecases/company-customer.use-case";
import {SriCustomerUseCase} from "@customer/core/usecases/sri-customer.use-case";

@Component({
  selector: 'app-company-customer-add-edit-dialog',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCustomDialogComponent ,
    M3InputChipComponent
  ],
  templateUrl: './company-customer-add-edit-dialog.component.html',
  styles: ``
})
export class CompanyCustomerAddEditDialogComponent {

  readonly dialogRef = inject(MatDialogRef<CompanyCustomerAddEditDialogComponent>);
      readonly params = inject<{
        id: number;
        descripcion: null | string
      }>(MAT_DIALOG_DATA);

  private _sriCustomerUseCase = inject(SriCustomerUseCase);
  private tS = inject(ToasterService);
  private _companyCustomerUseCase = inject(CompanyCustomerUseCase)

  title = 'Nuevo Cliente'
  btnText = 'Guardar'

  loading = false;

  emails: string[] = [];

  telephones: string[] = [];
  tiemposCredito: any[] = [];
  tipoContribuyentes: any[] = [];
  tiposCliente: any[] = [];
  tiposIdentificacion: any[] = [];


  numeroIdentificacion = new FormControl({ value: '', disabled: false }, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(15),
  ]);

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



  async getCustomer(codigo: string, id: string) {
    let exists = false;
    //check if exists for company

      this._companyCustomerUseCase.checkExistence({ textSearch: id })
     .subscribe( (response) => {
          if (response.code == '1') {
            this.tS.toastr({
              type: 'warning',
              message: 'El cliente ya se encuentra registrado en su empresa',
            });
            this.customerForm.patchValue({ numeroIdentificacion: '' });
            return
          }


       this._sriCustomerUseCase.search(codigo, id).subscribe(secondResponse=>{
         if(secondResponse.error){
           this.tS.toastr({
             type: 'info',
             message: secondResponse.error,
           });
           return;
         }



         if (secondResponse.telefono) {
           this.telephones = secondResponse.telefono.split(SEPARADORES_REGEX) || []
         }
         if (secondResponse.email) {
           this.emails = secondResponse.email.split(SEPARADORES_REGEX) || []
         }

         if (codigo == SRI_IDENTIFICATION_CODE.RUC) {
           if (secondResponse.numeroRuc) {
             this.customerForm.patchValue({
               numeroIdentificacion: secondResponse.numeroRuc,
               nombreFiscal: secondResponse.razonSocial,
               validationSri: true,
               direccion: secondResponse.direccion,
               nombreComercial: secondResponse.razonSocial,
             });
           }
         } else {
           if (secondResponse.identificacion) {
             this.customerForm.patchValue({
               numeroIdentificacion: secondResponse.identificacion,
               nombreFiscal: secondResponse.nombreCompleto,
               nombreComercial: secondResponse.nombreCompleto,
               direccion: secondResponse.direccion,
               validationSri: true,
             });
           }
         }





       })
    });

  }

  getLoadData(): Observable<any> {
    if (this.params.id > 0) {
      return forkJoin([
        this._companyCustomerUseCase.getDataForm(),
        this._companyCustomerUseCase.getId(this.params.id),
      ]);
    } else {
    }
    return this._companyCustomerUseCase.getDataForm();
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
        this.tipoContribuyentes = mainDataForm.tipoContribuyentes;

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
          this.title = 'Editar Cliente';
          this.btnText = 'Actualizar'
          this.emails = dataCompanyCustomer.correos;
          this.telephones = dataCompanyCustomer.telefonos;
          this.customerForm.patchValue(response[1]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


  onChangeTipoIdentificacion() {
    this.customerForm.patchValue({ numeroIdentificacion: '' });
  }

  copyTradeName() {}

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

  onSave() { ;

    this.customerForm.patchValue({
      telefono: this.telephones.length > 0 ? this.telephones.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });

    this.customerForm.patchValue({
      correo: this.emails.length > 0 ? this.emails.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });
    const dataForm = {
      ...this.customerForm.value,
    };

    if(this.customerForm.invalid){
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese todos datos requeridos'
      })
      return
    }

    if (this.params.id > 0) {
      this._companyCustomerUseCase
        .put(this.params.id, dataForm)
        .subscribe((response) => {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            this.dialogRef.close({
              id: this.params.id,
            });
          }
        });
    } else if (!(this.params.id > 0)) {
      this._companyCustomerUseCase.post(dataForm).subscribe((response) => {
        this.tS.toastr({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          let data = {
            id: (response.payload as any).id,
          };
          this.dialogRef.close(data);
        }
      });
    }
  }

  refreshTiempoCredito() {}


  close(){
    this.dialogRef.close()
  }
}
