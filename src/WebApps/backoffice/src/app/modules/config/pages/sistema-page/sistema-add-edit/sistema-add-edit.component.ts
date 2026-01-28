import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, OnInit } from '@angular/core';
import { Sistema } from '@modules/config/models/sistema';

import { Aplicacion } from '@modules/config/models/aplicacion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';

import { SistemaService } from '@modules/config/services/sistema.service';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-sistema-add-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    TabulatorComponent,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './sistema-add-edit.component.html',
  styles: ``,
})
export class SistemaAddEditComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<SistemaAddEditComponent>);
  private tS = inject(ToastrNotificationService);
  private sistemaService = inject(SistemaService);
  titleDialog = 'Nuevo Sistema';
  titleBtn = 'Guardar';
  data: Sistema = {
    id: 0,
    code: '',
    name: '',
    domainUrl: '',
    ipAddress: '',
    aplicaciones: [],
  };
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: string[] = [];

  tableData: Aplicacion[] = [
    { id: 0, name: '', code: '', domainUrl: '', ipAddress: '' },
  ];
  columnNames: any[] = [
    { title: 'Nombre', field: 'name', width: 150, editor: 'input' },
    { title: 'Código', field: 'code', width: 150, editor: 'input' },
    { title: 'Dominio', field: 'domainUrl', width: 150, editor: 'input' },
    { title: 'IP', field: 'ipAddress', width: 150, editor: 'input' },
  ];
  tab = window.document.createElement('div');

  ngOnInit(): void {
    if (this.data.id > 0 && this.data.aplicaciones.length > 0) {
      this.tableData = this.data.aplicaciones;
    }
  }

  addApp() {
    this.tableData.push({
      id: 0,
      name: '',
      code: '',
      domainUrl: '',
      ipAddress: '',
    });
  }

  save() {
    try {
      if (this.tableData.length > 0) {
        this.data.aplicaciones = this.tableData;
      }
      if (this.data.id > 0) {
        this.sistemaService
          .put(this.data.id, this.data)
          .subscribe(this.commonResponse);
      }

      if (!(this.data.id > 0)) {
        this.sistemaService.post(this.data).subscribe(this.commonResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      if (response.code === '0') {
        this.tS.show({
          type: 'warning',
          message: response.message!,
        });
      }
      if (response.code === '1') {
        this.tS.show({
          type: 'success',
          message: response.message!,
        });
        this.closeDialog(response);
      }
    }
  };

  closeDialog(response: any = '') {
    this.dialogRef.close(response);
  }
}
