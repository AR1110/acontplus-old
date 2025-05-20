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
import {getValidId, isValidField} from "@core/utils/utils";
import {ElectronicSignatureList} from "@modules/config/domain/models/electronic-signature.model";
import {
  CreateElectronicSignatureUseCase
} from "@modules/config/application/use-cases/electronic-signature/create-electronic-signature.use-case";
import {
  UpdateElectronicSignatureUseCase
} from "@modules/config/application/use-cases/electronic-signature/update-electronic-signature.use-case";
import {formatDateToString} from "@core/utils/date.util";

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
   params = inject<ElectronicSignatureList>(MAT_DIALOG_DATA);


  private $createUseCase = inject(CreateElectronicSignatureUseCase)
  private $updateUseCase = inject(UpdateElectronicSignatureUseCase)

  title = 'Nueva Firma Electrónica';
  btnText = 'Guardar';
  btnIcon = 'save';

  fileSign:File|undefined=undefined

  data = {
    idFirmaElectronica: 0,
    contrasenia: "" ,
    fechaCaducidad: null as Date | null,
    estado: true
  }

  ngOnInit(){
    if(this.params.idFirmaElectronica>0){
      this.title = 'Editar Firma Electrónica';
      this.btnText = 'Actualizar';
      this.btnIcon = 'edit';
      this.data.idFirmaElectronica = this.params.idFirmaElectronica;
      this.data.contrasenia = this.params.contrasenia;
      this.data.fechaCaducidad = new Date(this.params.fechaCaducidad)
    }
  }

  addEventDate( event: MatDatepickerInputEvent<Date>) {
     this.data.fechaCaducidad = event.value;
  }

  onFileSelected(event:Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileSign = file;
  }



  save(){


    if (!isValidField(this.data.contrasenia)) {
      Swal.fire({
        icon: 'warning',
        text:  'Ingrese la contraseña'
      })
      return;
    }
    if (!isValidField(this.data.fechaCaducidad)) {
      Swal.fire({
        icon: 'warning',
        text:  'Ingrese la fecha de caducidad'
      })
      return;
    }

    if(!getValidId(this.params.idFirmaElectronica) && !isValidField(this.fileSign)){
      Swal.fire({
        icon: 'warning',
        text:  'Selecionele el archivo de la firma!'
      })
      return
    }

    const fechaCaducidad = formatDateToString(this.data.fechaCaducidad as Date);

    if(getValidId(this.params.idFirmaElectronica)){
      this.$updateUseCase.execute({
        ...this.data,
        fechaCaducidad
      }).subscribe(this.successResponse);
      return;
    }
    this.$createUseCase.execute({
      ...this.data,
      fechaCaducidad,
      file: this.fileSign
    }).subscribe(this.successResponse)

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
