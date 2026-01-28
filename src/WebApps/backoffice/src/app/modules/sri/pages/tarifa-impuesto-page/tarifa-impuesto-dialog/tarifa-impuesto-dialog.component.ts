import { Component, inject } from '@angular/core';
import { TarifaImpuestoService } from '@modules/sri/services/tarifa-impuesto.service';
import { ApiResponse } from 'acontplus-utils';
import { Impuesto } from '@modules/sri/models/impuesto';
import { TarifaImpuesto } from '@modules/sri/models/tarifa-impuesto';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrNotificationService } from 'acontplus-utils';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-tarifa-impuesto-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './tarifa-impuesto-dialog.component.html',
  styles: ``,
})
export class TarifaImpuestoDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<TarifaImpuestoDialogComponent>,
  );
  private readonly tarifaImpuestoService = inject(TarifaImpuestoService);
  private readonly tS = inject(ToastrNotificationService);
  data: TarifaImpuesto = {
    idTarifaImpuesto: 0,
    codImpuesto: '',
    codigo: '',
    descripcion: '',
    porcentaje: 0,
    estado: false,
  };
  impuestos: Impuesto[] = [];
  dialogIcon = 'add';
  dialogTitle: string = 'Registrar Tarifa';
  tarifaImpuestoForm = new FormGroup({
    idTarifaImpuesto: new FormControl(0),
    codImpuesto: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
    ]),
    codigo: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(4),
    ]),
    descripcion: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(300),
    ]),
    porcentaje: new FormControl(0, [
      Validators.required,
      Validators.maxLength(5),
    ]),
    estado: new FormControl(true),
  });

  dialogClose() {
    this.dialogRef.close();
  }

  get() {
    this.tarifaImpuestoService.get({ tipo: 2 }).subscribe((response) => {
      if (response && response.code === '1') {
        let { impuestos } = JSON.parse(response.payload as string);
        this.impuestos = impuestos || [];
      }
    });
  }

  ngOnInit() {
    this.get();
    if (this.data.idTarifaImpuesto > 0) {
      this.tarifaImpuestoForm.patchValue(this.data);
    }
  }

  onSave() {
    let dataToSave = {
      ...this.tarifaImpuestoForm.value,
    };
    if (!(this.data.idTarifaImpuesto > 0)) {
      this.tarifaImpuestoService
        .post(dataToSave)
        .subscribe(this.commonResponse);
    } else {
      this.tarifaImpuestoService
        .put(this.data.idTarifaImpuesto, dataToSave)
        .subscribe(this.commonResponse);
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this.dialogRef.close(response);
      }
    }
  };
}
