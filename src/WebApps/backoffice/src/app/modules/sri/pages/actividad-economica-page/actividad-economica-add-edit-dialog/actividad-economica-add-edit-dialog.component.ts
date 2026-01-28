import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActividadEconomicaService } from '@modules/sri/services/actividad-economica.service';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatThemeButtonComponent} from "acontplus-ui-components";

@Component({
  selector: 'app-actividad-economica-add-edit-dialog',
  imports: [ReactiveFormsModule, MatSlideToggle, MatIcon, MatDialogContent, MatDialogActions, MatThemeButtonComponent],
  templateUrl: './actividad-economica-add-edit-dialog.component.html',
  styles: ``,
})
export class ActividadEconomicaAddEditDialogComponent {
  activityForm = new FormGroup({
    idActividadEconomica: new FormControl(0),
    codigo: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(9),
    ]),
    descripcion: new FormControl('', [Validators.required]),
    codGrupo: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(9),
    ]),
    grupo: new FormControl('', [Validators.required]),
    codTarifaImpuesto: new FormControl(''),
    estado: new FormControl(true),
  });
  data: any = {};
  dialogIcon = 'add';
  dialogTitle: string = 'Registrar Actividad Económica';
  tarifas: any[] = [];
  private dialogRef = inject(
    MatDialogRef<ActividadEconomicaAddEditDialogComponent>,
  );
  private readonly _aeService = inject(ActividadEconomicaService);
  private readonly _tS = inject(ToastrNotificationService);

  get() {
    this._aeService.get({ tipo: 2 }).subscribe((response) => {
      this.tarifas = response.tarifas;
    });
  }

  ngOnInit() {
    this.get();
    if (this.data.idActividadEconomica > 0) {
      this.dialogIcon = 'edit';
      this.dialogTitle = 'Editar Actividad Económica';
      this.activityForm.patchValue(this.data);
    }
  }

  onSave() {
    if (this.activityForm.invalid) {
      return this._tS.show({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }
    const dataToSave = {
      ...this.activityForm.value,
      porcentaje: this.tarifas.find(
        (x) => x.codigo === this.activityForm.get('codTarifaImpuesto')?.value,
      ).porcentaje,
    };
    if (this.data.idActividadEconomica > 0) {
      this._aeService
        .put(this.data.idActividadEconomica, dataToSave)
        .subscribe(this.commonResponse);
    } else {
      this._aeService.post(dataToSave).subscribe(this.commonResponse);
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

  commonResponse = (response: ApiResponse) => {
    this._tS.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code === '1') {
      this.dialogRef.close(response);
    }
  };
}
