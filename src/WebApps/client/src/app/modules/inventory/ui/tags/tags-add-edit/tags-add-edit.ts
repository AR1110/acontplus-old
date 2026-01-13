import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotificationService } from '@acontplus/ng-notifications';
import { isValidField } from '@core/utils/utils';
import { InputChip, Button } from '@acontplus/ng-components';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { TAG_SERVICE } from '@inventory/data/inventory-token';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { SEPARADORES_REGEX, SEPARATOR_KEY_CODE } from '@core/constants/global.constants';

@Component({
  selector: 'app-tags-add-edit',
  templateUrl: './tags-add-edit.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ToUpperCaseDirective,
    InputChip,
    Button,
    MatDialogActions,
    MatDialogContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsAddEdit implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TagsAddEdit>);
  readonly data = inject<{
    idEtiqueta: number;
    descripcion: string | null;
    estado: boolean;
    etiquetas: string;
  }>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private tagService = inject(TAG_SERVICE);

  btnText = 'Guardar';
  etiquetas: string[] = [];

  private successResponse = {
    next: (response: ApiResponseLegacy) => {
      if (response.code === '0') {
        this.tS.warning({ message: response.message });
      }
      if (response.code === '1') {
        this.tS.success({ message: response.message });
        this.dialogRef.close(response);
      }
    },
    error: (error: unknown) => {
      console.error(error);
    },
  };

  ngOnInit(): void {
    if (this.data.idEtiqueta > 0) {
      this.btnText = 'Actualizar';
      this.etiquetas = this.data.etiquetas.split(SEPARADORES_REGEX) || [];
    }
  }

  save(): void {
    try {
      if (!isValidField(this.data.descripcion)) {
        this.tS.warning({ message: 'Ingrese la descripción' });
        return;
      }

      if (this.etiquetas.length === 0) {
        this.tS.warning({ message: 'Ingrese al menos una etiqueta' });
        return;
      }

      const data = {
        descripcion: this.data.descripcion,
        estado: this.data.estado,
        etiquetas: this.etiquetas.join(SEPARATOR_KEY_CODE.SLASH),
      };

      const operation =
        this.data.idEtiqueta > 0
          ? this.tagService.put(this.data.idEtiqueta, data)
          : this.tagService.post(data);

      operation.subscribe(this.successResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
