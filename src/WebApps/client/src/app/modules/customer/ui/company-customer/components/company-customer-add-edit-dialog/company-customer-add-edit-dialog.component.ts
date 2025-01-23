import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { InputChipComponent } from '@shared/components/input-chip/input-chip.component';
import { M3InputChipComponent } from '@shared/components/m3-input-chip/m3-input-chip.component';

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
      readonly data = inject<{
        id: number;
        descripcion: null | string
      }>(MAT_DIALOG_DATA);


  title = 'Nuevo Cliente'

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



  onSave(){

  }

  close(){
    this.dialogRef.close()
  }
}
