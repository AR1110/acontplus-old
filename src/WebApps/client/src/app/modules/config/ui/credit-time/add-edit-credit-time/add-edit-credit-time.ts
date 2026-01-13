import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { CreateCreditTimeUseCase } from '@modules/config/application/use-cases/credit-time/create-credit-time.use-case';
import { UpdateCreditTimeUseCase } from '@modules/config/application/use-cases/credit-time/update-credit-time.use-case';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Button } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import Swal from 'sweetalert2';
import { CreditTimeList } from '@modules/config/domain/models/tiempo-credito.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Component({
  selector: 'app-add-edit-credit-time',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatSlideToggle,
    Button,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './add-edit-credit-time.html',
  styles: ``,
})
export class AddEditCreditTime implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEditCreditTime>);
  params = inject<CreditTimeList | { data: CreditTimeList }>(MAT_DIALOG_DATA);
  private tS = inject(NotificationService);

  private $createUseCase = inject(CreateCreditTimeUseCase);
  private $updateUseCase = inject(UpdateCreditTimeUseCase);

  btnText = 'Guardar';
  btnIcon = 'save';

  get getData(): CreditTimeList {
    return (this.params as any).data || (this.params as CreditTimeList);
  }

  dataForm = {
    descripcion: '',
    tipo: true,
    diasCredito: 0,
    numeroCuota: 1,
    entrada: false,
    gestion: true,
    estado: true,
  };

  handleChangeType() {
    if (this.dataForm.tipo) {
      this.dataForm.diasCredito = 0;
      this.dataForm.numeroCuota = 1;
      this.dataForm.entrada = false;
    }
  }

  ngOnInit() {
    if (this.getData.idTiempoCredito > 0) {
      this.btnText = 'Actualizar';
      this.btnIcon = 'edit';

      this.dataForm.descripcion = this.getData.descripcion;
      this.dataForm.tipo = this.getData.tipo;
      this.dataForm.diasCredito = this.getData.diasCredito;
      this.dataForm.numeroCuota = this.getData.numeroCuota;
      this.dataForm.entrada = this.getData.entrada;
      this.dataForm.gestion = this.getData.gestion;
      this.dataForm.estado = this.getData.estado;
    }
  }

  save() {
    const regex = /^(null|undefined|\s*)$/;
    const sendData = {
      estado: this.dataForm.estado,
    } as typeof this.dataForm;
    if (regex.test(this.dataForm.descripcion)) {
      this.tS.warning({ message: 'Ingrese la descripción' });
      return;
    }
    //Si es opcion  Credito
    if (!this.dataForm.tipo) {
      if (!(this.dataForm.diasCredito > 0)) {
        this.tS.warning({ message: 'Dias de Credito tiene que ser mayor a 0 días' });
        return;
      }
      if (!(this.dataForm.numeroCuota > 0)) {
        this.tS.warning({ message: 'El Número de Cuota tiene que ser mayor a 0' });
        return;
      }
      sendData.descripcion = this.dataForm.descripcion;
      sendData.tipo = this.dataForm.tipo;
      sendData.diasCredito = this.dataForm.diasCredito;
      sendData.gestion = this.dataForm.gestion;
      sendData.numeroCuota = this.dataForm.numeroCuota;
      sendData.entrada = this.dataForm.entrada;
    }
    if (this.dataForm.tipo) {
      if (this.dataForm.diasCredito !== 0) {
        this.tS.warning({ message: 'Los Días de Crédito no tiene que ser mayor a 0' });
        return;
      }
      if (this.dataForm.numeroCuota > 1) {
        this.tS.warning({ message: 'Número de Cuota tiene que ser igual a 1' });
        return;
      }
      if (this.dataForm.entrada) {
        this.tS.warning({ message: 'El Contado no lleva la Entrada' });
        return;
      }
      sendData.descripcion = this.dataForm.descripcion;
      sendData.tipo = this.dataForm.tipo;
      sendData.diasCredito = 0;
      sendData.gestion = this.dataForm.gestion;
      sendData.numeroCuota = 1;
      sendData.entrada = false;
    }

    if (this.getData.idTiempoCredito > 0) {
      this.$updateUseCase
        .execute({
          ...sendData,
          id: this.getData.idTiempoCredito,
        })
        .subscribe(this.successResponse);
      return;
    }
    this.$createUseCase
      .execute({
        ...sendData,
        id: this.getData.idTiempoCredito,
      })
      .subscribe(this.successResponse);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.warning({ message: response.message });
    }
    if (response.code === '1') {
      Swal.fire({
        icon: 'success',
        text: response.message,
        timer: 1000,
      });
      setTimeout(() => {
        this.dialogRef.close(response);
      }, 1000);
    }
  };
}
