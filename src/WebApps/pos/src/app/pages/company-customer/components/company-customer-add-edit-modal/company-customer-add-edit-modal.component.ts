import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {M3InputChipComponent} from "@core/components/m3-input-chip/m3-input-chip.component";
import {CompanyCustomerService} from "@/services/company-customer.service";
import { Observable, forkJoin } from 'rxjs';
import {SEPARATOR_KEY_CODE, SRI_IDENTIFICATION_CODE} from '@/enums/main.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ApiResponse} from "@/models/api-response";
import { ToasterService } from '@/services/toaster.service';
import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';

@Component({
  selector: 'app-company-customer-add-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
     MatButtonModule,
     MatTabsModule,
     MatSelectModule,
     MatInputModule,
     MatFormFieldModule,
     MatCheckboxModule,
     MatSlideToggleModule,
     M3InputChipComponent,
     CustomContainerDialogComponent
  ],
  templateUrl: './company-customer-add-edit-modal.component.html',
})
export class CompanyCustomerAddEditModalComponent {

  readonly matDialogData = inject<any>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CompanyCustomerAddEditModalComponent>);
  private companyCustomerSvc = inject(CompanyCustomerService)
  private tS = inject(ToasterService)

  modalTitle = 'Nuevo Cliente';
  btnText = 'Guardar'

  tiemposCredito: any[] = [];
  tipoContribuyentes: any[] = [];
  tiposCliente: any[] = [];
  tiposIdentificacion: any[] = [];

  emails = [];
  telefonos=[];

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

  getLoadData(): Observable<any> {
    if (this.matDialogData.id > 0) {
      return forkJoin([
        this.companyCustomerSvc.getDataForm(),
        this.companyCustomerSvc.getId(this.matDialogData.id),
      ]);
    } else {
    }
    return this.companyCustomerSvc.getDataForm();
  }

  ngOnInit(){
    try {
      console.log(this.matDialogData)
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

        if (!(this.matDialogData.id > 0)) {
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
          this.btnText='Actualizar'
          this.emails = dataCompanyCustomer.correos;
          this.telefonos = dataCompanyCustomer.telefonos;
          this.customerForm.patchValue(response[1]);
        }
      });
    }catch (error){

    }
  }



  onToggleSri(event: MouseEvent){
    event.stopPropagation()
  }


  private successResponse = (response:ApiResponse)=>{
    if(response.code==="0"){
      this.tS.toastr({
        type:'warning',
        message: response.message
      })
    }
    if(response.code==="1"){
      this.tS.toastr({
        type:'success',
        message: response.message
      })
      let id = this.matDialogData.id> 0  ? this.matDialogData.id: (response.payload as any).id;

      this.dialogRef.close({
        id,
      });
    }
  }

  onSave() {

    this.customerForm.patchValue({
      telefono: this.telefonos.length > 0 ? this.telefonos.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });

    this.customerForm.patchValue({
      correo: this.emails.length > 0 ? this.emails.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });

    if(this.customerForm.invalid){
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese todos los campos requeridos!'
      })
      return
    }
    const dataForm = this.companyCustomerSvc.adapterTo(this.customerForm.value)


    if (this.matDialogData.id > 0) {
      this.companyCustomerSvc.put(this.matDialogData.id, dataForm).subscribe(this.successResponse);
    }

    if (!(this.matDialogData.id > 0)) {
      this.companyCustomerSvc.post(dataForm).subscribe(this.successResponse);
    }
  }



  closeDialog(){
    this.dialogRef.close()
  }

}
