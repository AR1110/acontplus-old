import { Component, inject, Input, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NotificationService } from '@acontplus/ng-notifications';
import { Button, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import { isValidField } from '@core/utils/utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {
  DocConfigInfoAdicionalList,
  DocConfigList,
} from '@modules/config/domain/models/doc-config.model';
import { GetDocConfigInfoAdicionalUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-info-adicional.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CreateDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/create-doc-config.use-case';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-doc-config-info-adicional',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInput,
    Button,
    MatDialogContent,
    MatDialogActions,
    DataGrid,
  ],
  templateUrl: './doc-config-info-adicional.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocConfigInfoAdicional implements OnInit {
  private dialogRef = inject(MatDialogRef<DocConfigInfoAdicional>);
  data = inject<DocConfigList & { idPuntoEmision: number }>(MAT_DIALOG_DATA);

  private tS = inject(NotificationService);
  private $getInfoAdicional = inject(GetDocConfigInfoAdicionalUseCase);
  private $createUseCase = inject(CreateDocConfigUseCase);

  dataSource = signal<DocConfigInfoAdicionalList[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Op.' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'valor', header: 'Valor' },
    { field: 'politicaCredito', header: 'Política Crédito' },
  ];

  ngOnInit() {
    this.getInfoAdicional();
  }

  getInfoAdicional() {
    this.$getInfoAdicional.execute(this.data.idConfiguracionDocumento).subscribe((response) => {
      this.dataSource.set(response ?? []);
    });
  }

  addRow() {
    this.dataSource.update((ds) => {
      return [...ds, { unique: generateUuidv4(), nombre: '', valor: '', politicaCredito: false }];
    });
  }

  askToDelete(item: DocConfigInfoAdicionalList) {
    this.tS
      .confirm({
        message: 'Esta seguro de eliminar este elemento',
      })
      .subscribe((result) => {
        if (result.isConfirmed) {
          this.dataSource.update((ds) => {
            return ds.filter((ds) => ds.unique !== item.unique);
          });
        }
      });
  }

  save() {
    try {
      if (
        this.dataSource().some((item) => !(isValidField(item.nombre) ?? isValidField(item.valor)))
      ) {
        this.tS.warning({
          message: 'Los campos no pueden estar vacio',
        });
        return;
      }

      const data = {
        id: this.data.idConfiguracionDocumento,
        idPuntoEmision: this.data.idPuntoEmision,
        idTipoDocumento: this.data.idTipoDocumento,
        estado: this.data.estado,
        ultimaSecuencia: this.data.ultimaSecuencia,
        editInfo: true,
        infoAdicional:
          this.dataSource().length === 0
            ? null
            : // eslint-disable-next-line @typescript-eslint/no-unused-vars
              JSON.stringify(this.dataSource().map(({ unique, ...rest }) => rest)),
      };

      this.$createUseCase.execute(data).subscribe((response) => {
        if (response.code === '0') {
          this.tS.warning({ message: response.message });
        }
        if (response.code === '1') {
          this.tS.success({ message: response.message });
          this.dialogRef.close(response);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  closeDg() {
    this.dialogRef.close();
  }
}
