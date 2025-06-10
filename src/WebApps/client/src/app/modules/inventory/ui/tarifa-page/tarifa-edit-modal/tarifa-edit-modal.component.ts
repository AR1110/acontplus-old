import { Component, inject,  signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '@core/models/api-response';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';
import { TarifaService } from '@inventory/data/services/tarifa.service';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-tarifa-edit-modal',
  imports: [FormsModule, ToUpperCaseDirective,  ThemeButtonComponent, MatCustomDialogComponent,
  MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  templateUrl: './tarifa-edit-modal.component.html',
  styles: ``,
})
export class TarifaEditModalComponent {
   params =inject< {
    idTarifa: 0,
    codigo: null,
    descripcion: null,
    estado: true,
    ventaPorMayor: false,
  }>(MAT_DIALOG_DATA);
  modal = inject(MatDialogRef<TarifaEditModalComponent>);
  tS = inject(ToastrNotificationService);
  tarifaSvc = inject(TarifaService);

  btnText = 'Actualizar';
  titleModal = signal('Editar Tarifa');

  data = {
    idTarifa: 0,
    codigo: null,
    descripcion: null,
    estado: true,
    ventaPorMayor: false,
  };


  successReponse =  (response: ApiResponse) => {
      if (response.code === '0') {
        this.tS.toastr({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this.tS.toastr({
          type: 'success',
          message: response.message,
        });
        this.modal.close(response);
      }
  };

  ngOnInit() {
    this.data = {
      ...this.params,
    };
  }

  save() {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la descripción',
        });
        return;
      }

      if (!isValidField(this.data.codigo)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la código',
        });
        return;
      }

      this.tarifaSvc
        .put(this.data.idTarifa, this.data)
        .subscribe(this.successReponse);
    } catch (error) {
      console.log(error);
    }
  }

  closeModal() {
    this.modal.close();
  }
}
