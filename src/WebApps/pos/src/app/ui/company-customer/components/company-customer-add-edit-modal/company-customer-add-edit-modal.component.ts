
import { ApiResponse } from "@domain/models/api-response";
import { CompanyCustomerService } from "@data/repositories/company-customer/company-customer.service";
import { ToasterService } from '@domain/services/toaster.service';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA,  MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { forkJoin, Observable } from 'rxjs';
import { MatTooltipModule } from "@angular/material/tooltip";
import { M3InputChipComponent } from "@ui/components/m3-input-chip/m3-input-chip.component";
import { CustomContainerDialogComponent } from "@ui/components/custom-container-dialog/custom-container-dialog.component";
import { SEPARATOR_KEY_CODE, SRI_IDENTIFICATION_CODE } from "@domain/enums/main.enum";
import { isValidField } from "@domain/utils/utils";
import {CompanyCustomerDataFormUseCase} from "@domain/use-cases/company-customer/company-customer-data-form.use-case";
import {MatTabsModule} from "@angular/material/tabs";
import {CompanyCustomerGetIdUseCase} from "@domain/use-cases/company-customer/company-customer-get-id.use-case";
import {CompanyCustomerPostUseCase} from "@domain/use-cases/company-customer/company-customer-post.use-case";
import {CompanyCustomerPutUseCase} from "@domain/use-cases/company-customer/company-customer-put.use-case";

@Component({
    selector: 'app-company-customer-add-edit-modal',
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatTooltipModule,
      MatTabsModule,
        M3InputChipComponent,
        CustomContainerDialogComponent
    ],
    templateUrl: './company-customer-add-edit-modal.component.html'
})
export class CompanyCustomerAddEditModalComponent {

  readonly params = inject<any>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CompanyCustomerAddEditModalComponent>);
  private companyCustomerSvc = inject(CompanyCustomerService)
  private tS = inject(ToasterService)
  private $dataFormUseCase = inject(CompanyCustomerDataFormUseCase)
  private $getIdUseCase = inject(CompanyCustomerGetIdUseCase)
  private $postUseCase = inject(CompanyCustomerPostUseCase)
  private $putUseCase = inject(CompanyCustomerPutUseCase)


  selected = signal(0);

  modalTitle = 'Nuevo Cliente';
  btnText = 'Guardar'

  tiemposCredito: any[] = [];
  tipoContribuyentes: any[] = [];
  tiposCliente: any[] = [];
  tiposIdentificacion: any[] = [];

  emails = [];
  telefonos = [];

  errorNumeroIdentificacion = signal('')

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
    nombreComercial: new FormControl('', Validators.required),
    numeroIdentificacion: this.numeroIdentificacion,
    correo: new FormControl(''),
    telefono: new FormControl(''),
    estado: new FormControl(false),
    validationSri: new FormControl(false),
  });



  getLoadData(): Observable<any> {
    const requests = [this.$dataFormUseCase.execute()] ;

    if (this.params.id > 0) {
      requests.push(this.$getIdUseCase.execute(this.params.id));
    }

    return forkJoin(requests);
  }

  ngOnInit() {
    try {

      this.getLoadData()?.subscribe((response) => {
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

        if (this.params.dataOfSri) {

          let {
            numeroRuc,
            razonSocial,
            nombreComercial,
            direccion,
            telefonos,
            correos,
            codigoSri
          } = this.params;
          const dataIdentificacion = this.tiposIdentificacion.find(obj => obj.codigoSri === codigoSri);


          this.customerForm.patchValue({
            idTipoIdentificacion: dataIdentificacion.idTipoIdentificacion,
            numeroIdentificacion: numeroRuc,
            nombreFiscal: razonSocial,
            nombreComercial: nombreComercial ?? razonSocial,
            direccion,
            validationSri: true,
            idTiempoCredito:
              this.tiemposCredito.length > 0
                ? this.tiemposCredito[0].idTiempoCredito
                : 0,
          });

          this.emails = correos;
          this.telefonos = telefonos;


        } else if (!(this.params.id > 0)) {
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
          this.modalTitle = 'Editar Cliente';
          this.btnText = 'Actualizar'
          this.emails = dataCompanyCustomer.correos;
          this.telefonos = dataCompanyCustomer.telefonos;
          this.customerForm.patchValue(response[1]);
        }
      });
    } catch (error) {

    }
  }


  private syncDataOfSri() {
    let dataNroIdentificacion = this.getDataNroIdentificacion();
    let { numeroIdentificacion } = this.customerForm.value;

    if (this.isValidNroIdentificacion()) {
      this.customerForm.patchValue({
        validationSri: false
      })
      if (dataNroIdentificacion.codigoSri === SRI_IDENTIFICATION_CODE.RUC) {
        this.companyCustomerSvc.checkClientSRIByRUC(numeroIdentificacion!).subscribe(response => {
          const { numeroRuc, razonSocial, direccion, telefonos, correos, error, nombreComercial } = response;

          if (error) {
            this.tS.toastr({
              type: 'warning',
              message: error
            })
            return
          }

          this.customerForm.patchValue({
            numeroIdentificacion: numeroRuc,
            nombreFiscal: razonSocial,
            nombreComercial: nombreComercial ?? razonSocial,
            direccion,
            validationSri: true
          });

          this.updateEmailTelOfSri(correos, telefonos)

        })
      }

      if (dataNroIdentificacion.codigoSri === SRI_IDENTIFICATION_CODE.CEDULA) {
        this.companyCustomerSvc.checkClientSRIByCedula(numeroIdentificacion!).subscribe(response => {

          const { direccion, correos, error, nombreCompleto, telefonos } = response;
          if (error) {
            this.tS.toastr({
              type: 'warning',
              message: error
            })
            return
          }

          this.customerForm.patchValue({
            numeroIdentificacion,
            nombreFiscal: nombreCompleto,
            nombreComercial: nombreCompleto,
            direccion,
            validationSri: true
          });


          this.updateEmailTelOfSri(correos, telefonos)


        })

      }

    }
  }

  private updateEmailTelOfSri(correos: any, telefonos:any){

    if(this.params.id>0) return

    this.emails = correos;
    this.telefonos = telefonos;


  }


  onTipoIdentificacionChange(event: MatSelectChange): void {

    this.customerForm.patchValue({
      numeroIdentificacion: null,
      validationSri: false
    });
    this.errorNumeroIdentificacion.set('');

  }

  enterInputNroIdentificacion(event: Event): void {
    event.preventDefault();
    if (!this.isValidNroIdentificacion()) return
    this.syncDataOfSri()
  }

  private getDataNroIdentificacion() {
    let data = this.tiposIdentificacion.find(e => e.idTipoIdentificacion === this.customerForm.value.idTipoIdentificacion)
    return data ?? {}
  }

  private isValidNroIdentificacion(): boolean {
    const dataNroIdentificacion = this.getDataNroIdentificacion();
    const { numeroIdentificacion } = this.customerForm.value;

    this.errorNumeroIdentificacion.set('');

    if (![SRI_IDENTIFICATION_CODE.RUC, SRI_IDENTIFICATION_CODE.CEDULA].includes(dataNroIdentificacion.codigoSri)) {
      return false;
    }
    const trimmedNumeroIdentificacion = numeroIdentificacion?.trim() || ''

    if (!isValidField(trimmedNumeroIdentificacion)) {
      this.errorNumeroIdentificacion.set('Ingrese número de identificación');
      return false;
    }


    switch (dataNroIdentificacion.codigoSri) {
      case SRI_IDENTIFICATION_CODE.RUC:
        if (trimmedNumeroIdentificacion.length !== 13) {
          this.errorNumeroIdentificacion.set('Número de RUC debe tener 13 dígitos');
          return false;
        }
        if (!trimmedNumeroIdentificacion.endsWith('001')) {
          this.errorNumeroIdentificacion.set('Número de RUC debe terminar en "001"');
          return false;
        }
        break;

      case SRI_IDENTIFICATION_CODE.CEDULA:
        if (trimmedNumeroIdentificacion.length !== 10) {
          this.errorNumeroIdentificacion.set('Número de cédula debe tener 10 dígitos');
          return false;
        }
        break;
    }

    return true;
  }


  keyupInputNroIdentificacion() {
    this.isValidNroIdentificacion()

  }


  syncDataSri(event: MouseEvent) {
    event.stopPropagation()
    if (!this.isValidNroIdentificacion()) return
    this.syncDataOfSri()
  }


  private successResponse = (response: ApiResponse) => {
    if (response.code === "0") {
      this.tS.toastr({
        type: 'warning',
        message: response.message
      })
    }
    if (response.code === "1") {
      this.tS.toastr({
        type: 'success',
        message: response.message
      })
      let id = this.params.id > 0 ? this.params.id : (response.payload as any).id;

      this.dialogRef.close({
        id,
      });
    }
  }

  onSave() {

    const dataNroIdentificacion = this.getDataNroIdentificacion();
    if (this.params.id > 0 && dataNroIdentificacion.codigoSri === SRI_IDENTIFICATION_CODE.CONSUMIDOR_FINAL) {
      this.tS.toastr({
        type: 'warning',
        message: 'Consumidor Final no puede ser editada'
      })
      return
    }

    if (!this.isValidNroIdentificacion()) {
      this.tS.toastr({
        type: 'warning',
        message: this.errorNumeroIdentificacion()
      })
      return
    }

    this.customerForm.patchValue({
      telefono: this.telefonos.length > 0 ? this.telefonos.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });

    this.customerForm.patchValue({
      correo: this.emails.length > 0 ? this.emails.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });

    if (this.customerForm.invalid) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese todos los campos requeridos!'
      })
      return
    }
    if (this.params.id > 0) {
      this.$putUseCase.execute(this.params.id, this.customerForm.value).subscribe(this.successResponse);
    }

    if (!(this.params.id > 0)) {
      this.$postUseCase.execute(this.customerForm.value).subscribe(this.successResponse);
    }
  }



  closeDialog() {
    this.dialogRef.close()
  }

}
