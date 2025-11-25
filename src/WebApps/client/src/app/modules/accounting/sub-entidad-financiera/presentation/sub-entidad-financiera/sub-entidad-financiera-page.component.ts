import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { SubEntidadFinancieraRead } from '@accounting/sub-entidad-financiera/domain/subentidad-financiera.model';
import { SubEntidadFinancieraDialogComponent } from '@accounting/sub-entidad-financiera/presentation/sub-entidad-financiera-modal/sub-entidad-financiera-dialog.component';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubEntidadFinancieraUseCase } from '@accounting/sub-entidad-financiera/application/sub-entidad-financiera.use-case';
import { DialogService } from '@core/services/dialog.service';
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-sub-entidad-financiera-page',
  imports: [
    MatExpansionModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    MatDynamicTableComponent,
    DynamicCard,
  ],
  templateUrl: './sub-entidad-financiera-page.component.html',
})
export class SubEntidadFinancieraPageComponent implements OnInit {
  private readonly _dialogSvc = inject(DialogService);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _sfUseCase = inject(SubEntidadFinancieraUseCase);
  private readonly _cdr = inject(ChangeDetectorRef);

  entidadesFinanciera: EntidadFinanciera[] = [];
  cloneSubEntidadesFinanciera: SubEntidadFinancieraRead[] = [];

  subEntidadesFinanciera = new MatTableDataSource<SubEntidadFinancieraRead>();

  dataEntidadFinanciera = {} as EntidadFinanciera;

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'codigo', label: 'Código', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  getData() {
    this._sfUseCase.getAll().subscribe((data) => {
      this.entidadesFinanciera = structuredClone(data.entidadesFinancieras);

      this.cloneSubEntidadesFinanciera = structuredClone(data.subEntidadesFinancieras);

      if (this.dataEntidadFinanciera.idEntidadFinanciera > 0) {
        this.showAccordion(this.dataEntidadFinanciera);
      }
      this._cdr.detectChanges();
    });
  }

  showAccordion(dataEntidadFinanciera: EntidadFinanciera) {
    this.dataEntidadFinanciera = dataEntidadFinanciera;
    this.subEntidadesFinanciera.data = [];

    const subEntidadFiltered = this.cloneSubEntidadesFinanciera.filter(
      (e) => e.idEntidadFinanciera === dataEntidadFinanciera.idEntidadFinanciera,
    );

    this.subEntidadesFinanciera = new MatTableDataSource(structuredClone(subEntidadFiltered));
    this._cdr.detectChanges();
  }

  ngOnInit() {
    this.getData();
  }

  openDialog(data?: SubEntidadFinancieraRead) {
    let params = {
      idEntidadFinanciera: this.dataEntidadFinanciera?.idEntidadFinanciera,
      nameEntidadFinanciera: this.dataEntidadFinanciera?.descripcion,
    };

    params = data ? { ...params, ...data } : params;

    const dialogRef = this._dialogSvc.open(SubEntidadFinancieraDialogComponent, {
      size: 'md',
      data: params,
    });

    dialogRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') {
        this.getData();
      }
    });
  }

  askToDelete(data: SubEntidadFinancieraRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: '<small>Está seguro/a de eliminar este registro ahora?</small>',
        showDenyButton: true,
        confirmButtonText: `Si, eliminar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this._sfUseCase.delete(data.idSubEntidadFinanciera).subscribe((value) => {
            this._tS.show({
              type: value.code === '1' ? 'success' : 'warning',
              message: value.message,
            });
            if (value.code === '1') {
              this.getData();
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
