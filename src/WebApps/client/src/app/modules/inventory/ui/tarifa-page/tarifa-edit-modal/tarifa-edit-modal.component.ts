import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';
import { TARIFA_SERVICE } from '@inventory/data/inventory-token';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-tarifa-edit-modal',
  imports: [
    FormsModule,
    ToUpperCaseDirective,
    Button,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  templateUrl: './tarifa-edit-modal.component.html',
  styles: ``,
})
export class TarifaEditModalComponent implements OnInit {
  params = inject<{
    idTarifa: 0;
    codigo: null;
    descripcion: null;
    estado: true;
    ventaPorMayor: false;
  }>(MAT_DIALOG_DATA);
  modal = inject(MatDialogRef<TarifaEditModalComponent>);
  tS = inject(ToastrNotificationService);
  tarifaSvc = inject(TARIFA_SERVICE);

  btnText = 'Actualizar';
  titleModal = signal('Editar Tarifa');

  data = {
    idTarifa: 0,
    codigo: null,
    descripcion: null,
    estado: true,
    ventaPorMayor: false,
  };

  successReponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.show({
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
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la descripción',
        });
        return;
      }

      if (!isValidField(this.data.codigo)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la código',
        });
        return;
      }

      this.tarifaSvc.put(this.data.idTarifa, this.data).subscribe(this.successReponse);
    } catch (error) {
      console.log(error);
    }
  }

  closeModal() {
    this.modal.close();
  }
}
