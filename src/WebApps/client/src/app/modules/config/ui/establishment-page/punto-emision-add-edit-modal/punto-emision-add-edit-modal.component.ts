
import { Component, inject, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';
import { PuntoEmisionService } from '@modules/config/services/sri/punto-emision.service';
import { InputNumberDirective } from '@shared/directives/ui/input-number.directive';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {  MatInputModule, } from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

@Component({
  selector: 'app-punto-emision-add-edit-modal',
  imports: [InputNumberDirective, FormsModule, ThemeButtonComponent, MatCustomDialogComponent,
  MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './punto-emision-add-edit-modal.component.html',
  styleUrl: './punto-emision-add-edit-modal.component.scss',
})
export class PuntoEmisionAddEditModalComponent implements OnInit {
    params = inject<{
    codEstab: null,
    establishmentName: '',
    idPuntoEmision: 0,
    estado: false,
    ptoEmi: '',
    ambiente: '1',
  }>(MAT_DIALOG_DATA);
  modal = inject(MatDialogRef<PuntoEmisionAddEditModalComponent>);
  tS = inject(ToastrNotificationService);
  ptoEmisionSvc = inject(PuntoEmisionService);

  tiposAmbiente = [
    { code: '1', description: 'Pruebas' },
    { code: '2', description: 'Producción' },
  ];

  titleModal = 'Nuevo Punto Emisión';
  btnText = 'Guardar';

  data = {
    ptoEmi: '',
    ambiente: '1',
    estado: true,
  };
  successResponse = (response: any) => {
        if (response.code == '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code == '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.modal.close(response);
        }
  };

  ngOnInit() {
    if (this.params.idPuntoEmision > 0) {
      this.titleModal = 'Editar Punto Emisión';
      this.btnText = 'Actualizar';
      this.data.estado = this.params.estado;
      this.data.ptoEmi = this.params.ptoEmi;
      this.data.ambiente = this.params.ambiente;
    }
  }

  save() {
    try {
      if (isNaN(parseFloat(this.data.ptoEmi))) {
        this.tS.show({
          type: 'warning',
          message: 'El punto de emisión tiene que ser número',
        });
        return;
      }

      if (isValidField(this.data.ptoEmi) && this.data.ptoEmi?.length !== 3) {
        this.tS.show({
          type: 'warning',
          message: 'El punto de emisión es requerido',
        });
        return;
      }

      const regex = /^\d{3}$/;
      if (!regex.test(this.data.ptoEmi)) {
        this.tS.show({
          type: 'warning',
          message: 'El punto de emisión tiene que ser de tres dígitos',
        });
        return;
      }
      const params = {
        codEstab: this.params.codEstab,
        ptoEmi: this.data.ptoEmi,
        ambiente: this.data.ambiente,
        estado: this.data.estado,
      };
      if (!(this.params.idPuntoEmision > 0)) {
        this.ptoEmisionSvc.post(params).subscribe(this.successResponse);
      }

      if (this.params.idPuntoEmision > 0) {
        this.ptoEmisionSvc
          .put(this.params.idPuntoEmision, params)
          .subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
  close(){
    this.modal.close();
  }
}
