import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';
import { InputChip } from '@acontplus/ng-components';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TagUseCase } from '@inventory/domain/usecases/tag.use-case';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { SEPARADORES_REGEX, SEPARATOR_KEY_CODE } from '@core/constants/global.constants';

@Component({
  selector: 'app-tags-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ToUpperCaseDirective,
    InputChip,
    MatCustomDialogComponent,
  ],
  templateUrl: './tags-add-edit-modal.component.html',
  styles: ``,
})
export class TagsAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TagsAddEditModalComponent>);

  readonly data = inject<{
    idEtiqueta: number;
    descripcion: string | null;
    estado: boolean;
    etiquetas: string;
  }>(MAT_DIALOG_DATA);

  tS = inject(ToastrNotificationService);
  private _tagUseCase = inject(TagUseCase);

  btnText = 'Guardar';
  titleModal = signal('Nuevo');

  etiquetas: string[] = [];

  // data = {
  //   idEtiqueta: 0,
  //   descripcion: null,
  //   estado: true
  // }

  marcas = signal<any[]>([]);

  successReponse = {
    next: (response: ApiResponseLegacy) => {
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
        this.dialogRef.close(response);
      }
    },
    error(error: any) {
      console.log(error);
    },
  };

  ngOnInit() {
    if (this.data.idEtiqueta > 0) {
      this.btnText = 'Actualizar';
      this.titleModal.set('Editar ');
      this.etiquetas = this.data.etiquetas.split(SEPARADORES_REGEX) || [];
    }
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

      if (this.etiquetas.length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese al menos una etiqueta',
        });
        return;
      }

      const data = {
        descripcion: this.data.descripcion,
        estado: this.data.estado,
        etiquetas: this.etiquetas.join(SEPARATOR_KEY_CODE.SLASH),
      };

      if (this.data.idEtiqueta > 0) {
        this._tagUseCase.put(this.data.idEtiqueta, data).subscribe(this.successReponse);
      } else {
        this._tagUseCase.post(data).subscribe(this.successReponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
