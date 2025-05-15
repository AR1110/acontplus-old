import {Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {WarehouseList} from "@inventory/domain/models/warehouse.model";
import {ApiResponse} from "@core/models/api-response";
import Swal from "sweetalert2";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {isValidField} from "@core/utils/utils";

@Component({
  selector: 'app-add-edit-electronic-signature',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './add-edit-electronic-signature.component.html',
  providers: [provideNativeDateAdapter()],
})
export class AddEditElectronicSignatureComponent {
  private dialogRef = inject(MatDialogRef<AddEditElectronicSignatureComponent>);
  private params = inject<WarehouseList>(MAT_DIALOG_DATA);
  title = 'Nueva Firma Electrónica';
  btnText = 'Guardar';
  btnIcon = 'save';

  fileSign:File|undefined=undefined

  data = {
    contrasenia: null as string| null,
    fechaCaducidad: null as Date|null
  }

  addEventDate( event: MatDatepickerInputEvent<Date>) {
     this.data.fechaCaducidad = event.value;
  }

  onFileSelected(event:Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileSign = file;
    console.log(this.fileSign)
  }

  save(){
    if(isValidField(this.fileSign)){
      Swal.fire({
        icon: 'warning',
        text:  'Selecionele el archivo de la firma!'
      })
      return
    }

    if (isValidField(this.data.contrasenia)) {
      Swal.fire({
        icon: 'warning',
        text:  'Ingrese la contraseña'
      })
      return;
    }
    if (isValidField(this.data.fechaCaducidad)) {
      Swal.fire({
        icon: 'warning',
        text:  'Ingrese la fecha de caducidad'
      })
      return;
    }
  }

  successResponse = (response:ApiResponse)=>{
    if(response.code==="0"){
      Swal.fire({
        icon: 'warning',
        text: response.message
      })
    }
    if(response.code==="1"){
      Swal.fire({
        icon: 'success',
        text: response.message,
        timer: 1000
      })
      this.dialogRef.close(response)
    }
  }
  close(){
    this.dialogRef.close()
  }
}
