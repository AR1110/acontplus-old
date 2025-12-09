import {
  Component,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TabulatorTable } from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { isValidField } from '@core/utils/utils';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DocConfigInfoAdicional,
  DocConfigList,
} from '@modules/config/domain/models/doc-config.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
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
    MatCustomDialogComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './doc-config-info-adicional.component.html',
  styles: ``,
})
export class DocConfigInfoAdicionalComponent implements OnInit, AfterViewInit {
  private dialogRef = inject(MatDialogRef<DocConfigInfoAdicionalComponent>);
  @Input() params = inject<DocConfigList & { idPuntoEmision: number }>(MAT_DIALOG_DATA);

  private tS = inject(ToastrNotificationService);
  private $getInfoAdicional = inject(GetDocConfigInfoAdicionalUseCase);
  private $createUseCase = inject(CreateDocConfigUseCase);

  @ViewChild(TabulatorTable) tabulatorComponent!: TabulatorTable;

  dataSource = signal<DocConfigInfoAdicional[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nombre', label: 'Nombre', type: 'template' },
    { key: 'valor', label: 'Valor', type: 'template' },
    { key: 'politicaCredito', label: 'Política Crédito', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  @ViewChild('templateName') templateName!: TemplateRef<any>;
  @ViewChild('templateValue') templateValue!: TemplateRef<any>;
  @ViewChild('templatePoliticaCredito') templatePoliticaCredito!: TemplateRef<any>;

  getInfoAdicional() {
    this.dataSource.set([]);
    this.$getInfoAdicional.execute(this.params.idConfiguracionDocumento).subscribe((response) => {
      this.dataSource.set(response);
    });
  }

  ngOnInit() {
    this.getInfoAdicional();
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template' && col.key === 'nombre') {
        col.templateOutlet = this.templateName;
      }
      if (col.type === 'template' && col.key === 'valor') {
        col.templateOutlet = this.templateValue;
      }

      if (col.type === 'template' && col.key === 'politicaCredito') {
        col.templateOutlet = this.templatePoliticaCredito;
      }
    });
  }

  addRow() {
    this.dataSource.update((ds) => {
      return [...ds, { unique: generateUuidv4(), nombre: '', valor: '', politicaCredito: false }];
    });
  }

  askToDelete(item: DocConfigInfoAdicional) {
    try {
      Swal.fire({
        html: `Esta seguro de eliminar este elemento`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.dataSource.update((ds) => {
            return ds.filter((ds) => ds.unique !== item.unique);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  save() {
    try {
      if (
        this.dataSource().some((item) => !(isValidField(item.nombre) || isValidField(item.valor)))
      ) {
        this.tS.show({
          type: 'warning',
          message: 'Los campos no pueden estar vacio',
        });
        return;
      }

      const data = {
        id: this.params.idConfiguracionDocumento,
        idPuntoEmision: this.params.idPuntoEmision,
        idTipoDocumento: this.params.idTipoDocumento,
        estado: this.params.estado,
        ultimaSecuencia: this.params.ultimaSecuencia,
        editInfo: true,
        infoAdicional:
          this.dataSource().length == 0
            ? null
            : // eslint-disable-next-line @typescript-eslint/no-unused-vars
              JSON.stringify(this.dataSource().map(({ unique, ...rest }) => rest)),
      };

      this.$createUseCase.execute(data).subscribe((response) => {
        if (response.code === '0') {
          Swal.fire({
            icon: 'warning',
            text: response.message,
          });
        }
        if (response.code === '1') {
          Swal.fire({
            icon: 'success',
            text: response.message,
            timer: 1000,
          });
          this.dialogRef.close(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  close() {
    this.dialogRef.close();
  }
}
