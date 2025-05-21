import {Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CreateCreditTimeUseCase} from "@modules/config/application/use-cases/credit-time/create-credit-time.use-case";
import {UpdateCreditTimeUseCase} from "@modules/config/application/use-cases/credit-time/update-credit-time.use-case";

import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import Swal from "sweetalert2";
import {CreditTimeList} from "@modules/config/domain/models/tiempo-credito.model";
import {ApiResponse} from "@core/models/api-response";

@Component({
  selector: 'app-add-edit-credit-time',
  imports: [
    MatCustomDialogComponent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatSlideToggle,
    ThemeButtonComponent
  ],
  templateUrl: './add-edit-credit-time.component.html',
  styles: ``
})
export class AddEditCreditTimeComponent {
  private dialogRef = inject(MatDialogRef<AddEditCreditTimeComponent>);
  params = inject<CreditTimeList>(MAT_DIALOG_DATA);


  private $createUseCase = inject(CreateCreditTimeUseCase)
  private $updateUseCase = inject(UpdateCreditTimeUseCase)

  title = 'Nuevo Tiempo Crédito';
  btnText = 'Guardar';
  btnIcon = 'save';

  data  = {
    descripcion: '',
    tipo: true,
    diasCredito: 0,
    numeroCuota: 1,
    entrada: false,
    gestion: true,
  }



  handleChangeType(){
    if (this.data.tipo) {
      this.data.diasCredito = 0;
      this.data.numeroCuota = 1;
      this.data.entrada = false;
    }
  }

  ngOnInit(){
    if(this.params.idTiempoCredito>0){
      this.title = 'Editar Tiempo Crédito';
      this.btnText = 'Actualizar';
      this.btnIcon = 'edit';

      this.data.descripcion = this.params.descripcion;
      this.data.tipo = this.params.tipo;
      this.data.diasCredito = this.params.diasCredito;
      this.data.numeroCuota = this.params.numeroCuota;
      this.data.entrada = this.params.entrada;
      this.data.gestion = this.params.gestion;
    }
  }

  save(){
    let regex = /^(null|undefined|\s*)$/;
    const sendData = {} as typeof this.data;
    if (regex.test(this.data.descripcion)) {
      Swal.fire({
        icon: 'warning',
        text: 'Ingrese la descripción'
      })
      return;
    }
    //Si es opcion  Credito
    if (!this.data.tipo) {
      if (!(this.data.diasCredito > 0)) {
        Swal.fire({
          icon: 'warning',
          text:  'Dias de Credito tiene que ser mayor a 0 días'
        })
        return;
      }
      if (!(this.data.numeroCuota > 0)) {
        Swal.fire({
          icon: 'warning',
          text:   'El Número de Cuota tiene que ser mayor a 0'
        })
        return;
      }
      sendData.descripcion = this.data.descripcion;
      sendData.tipo = this.data.tipo;
      sendData.diasCredito = this.data.diasCredito;
      sendData.gestion = this.data.gestion;
      sendData.numeroCuota = this.data.numeroCuota;
      sendData.entrada=this.data.entrada;
    }
    if (this.data.tipo) {
      if (this.data.diasCredito !== 0) {
        Swal.fire({
          icon: 'warning',
          text:  'Los Días de Crédito no tiene que ser mayor a 0',
        })
        return;
      }
      if (this.data.numeroCuota > 1) {
        Swal.fire({
          icon: 'warning',
          text:  'Número de Cuota tiene que ser igual a 1',
        })
        return;
      }
      if (this.data.entrada) {
        Swal.fire({
          icon: 'warning',
          text:  'El Contado no lleva la Entrada '
        })
        return;
      }
      sendData.descripcion = this.data.descripcion;
      sendData.tipo = this.data.tipo;
      sendData.diasCredito =0;
      sendData.gestion = this.data.gestion;
      sendData.numeroCuota =1;
      sendData.entrada=false;
    }

    if(this.params.idTiempoCredito>0){
      this.$updateUseCase.execute({
        ...sendData,
        id: this.params.idTiempoCredito
      }).subscribe(this.successResponse)
      return;
    }
    this.$createUseCase.execute({
      ...sendData,
      id: this.params.idTiempoCredito
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
      setTimeout(()=>{
      this.dialogRef.close(response)

      }, 1000)
    }
  }

  close(){
    this.dialogRef.close()
  }
}
