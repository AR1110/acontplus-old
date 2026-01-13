import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { SubEntidadFinancieraRead } from '@accounting/data/models/subentidad-financiera.model';
import { SubEntidadFinancieraDialogComponent } from '@accounting/ui/sub-entidad-financiera-page/sub-entidad-financiera-modal/sub-entidad-financiera-dialog.component';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { DialogService } from '@core/services/dialog.service';
import { DataGrid, DataGridColumn, Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-sub-entidad-financiera-page-page',
  imports: [
    MatExpansionModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    DataGrid,
    Button,
  ],
  templateUrl: './sub-entidad-financiera-page.html',
})
export class SubEntidadFinancieraPage implements OnInit {
  private readonly _dialogSvc = inject(DialogService);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _sfHttp = inject(SUB_ENTIDAD_FINANCIERA_HTTP_TOKEN);
  private readonly _cdr = inject(ChangeDetectorRef);

  entidadesFinanciera: EntidadFinanciera[] = [];
  cloneSubEntidadesFinanciera: SubEntidadFinancieraRead[] = [];

  subEntidadesFinanciera: SubEntidadFinancieraRead[] = [];

  dataEntidadFinanciera = {} as EntidadFinanciera;

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Op.' },
    { field: 'codigo', header: 'Código' },
    { field: 'descripcion', header: 'Descripción' },
  ];

  getData() {
    this._sfHttp.getAll().subscribe((data) => {
      this.entidadesFinanciera = structuredClone(data.entidadesFinancieras as EntidadFinanciera[]);

      this.cloneSubEntidadesFinanciera = structuredClone(
        data.subEntidadesFinancieras as SubEntidadFinancieraRead[],
      );

      if (this.dataEntidadFinanciera.idEntidadFinanciera > 0) {
        this.showAccordion(this.dataEntidadFinanciera);
      }
      this._cdr.detectChanges();
    });
  }

  showAccordion(dataEntidadFinanciera: EntidadFinanciera) {
    this.dataEntidadFinanciera = dataEntidadFinanciera;
    this.subEntidadesFinanciera = [];

    const subEntidadFiltered = this.cloneSubEntidadesFinanciera.filter(
      (e) => e.idEntidadFinanciera === dataEntidadFinanciera.idEntidadFinanciera,
    );

    this.subEntidadesFinanciera = structuredClone(subEntidadFiltered);
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
      void Swal.fire({
        icon: 'warning',
        html: '<small>Está seguro/a de eliminar este registro ahora?</small>',
        showDenyButton: true,
        confirmButtonText: `Si, eliminar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this._sfHttp.delete(data.idSubEntidadFinanciera).subscribe((value) => {
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
      console.error(error);
    }
  }
}
