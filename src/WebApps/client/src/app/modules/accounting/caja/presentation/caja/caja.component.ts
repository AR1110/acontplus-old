import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToasterService } from '@core/services/toaster.service';

import { getPermisosLocal } from '@core/utils/utils';
import { CashboxList } from '@accounting/caja/domain/caja.entity';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import { ActionAperturaCajaDirective } from '@shared/directives/permission/action-apertura-caja.directive';
import { ActionDeleteDirective } from '@shared/directives/permission/action-delete.directive';
import { ActionEditDirective } from '@shared/directives/permission/action-edit.directive';
import { ActionMovCajaDirective } from '@shared/directives/permission/action-mov-caja.directive';
import Swal from 'sweetalert2';

import { AperturaCajaModalComponent } from '@accounting/caja/presentation/components/apertura-caja-modal/apertura-caja-modal.component';
import { CajaModalComponent } from '@accounting/caja/presentation/components/caja-modal/caja-modal.component';
import { CajaUseCase } from '@accounting/caja/application/use-cases/caja.use-case';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatPagination } from '@shared/models/pagination.model';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { ControlCajaModalComponent } from '@accounting/caja/presentation/control-caja-modal/control-caja-modal.component';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-cashbox',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    BreadcrumbComponent,
    FormsModule,
    ActionAddDirective,
    ActionEditDirective,
    ActionDeleteDirective,
    ActionAperturaCajaDirective,
    ActionMovCajaDirective,
    MatDynamicTableComponent,
  ],
  templateUrl: './caja.component.html',
})
export class CajaComponent implements OnInit {
  private tS = inject(ToasterService);
  private _cajaUseCase = inject(CajaUseCase);
  private _dialogSvc = inject(DialogService);

  acciones: any = {};

  cashboxs = signal<CashboxList[]>([]);

  dataSearch = {
    pageIndex: 1,
    pageSize: 10,
    maxSize: 5,
  };

  page = 1;

  totalRecords = 0;

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'turno', label: 'Turno', type: 'string' },
    { key: 'actividad', label: 'Actividad', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  refresh() {
    this.getCashboxs();
  }

  getCashboxs() {
    const params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
    };

    this._cajaUseCase.getAll(params).subscribe((response) => {
      this.cashboxs.set(response);
      this.pagination.update((item) => {
        return {
          ...item,
          totalRecords:
            this.cashboxs.length > 0 ? this.cashboxs()[0]?.totalRecords : 0,
        };
      });
    });
  }

  ngOnInit() {
    this.getCashboxs();

    const getDataPermiso: any = getPermisosLocal();

    if (getDataPermiso) {
      this.acciones = getDataPermiso.acciones;
    }
  }

  openModalAddUpdate(params?: CashboxList) {
    const modalRef = this._dialogSvc.open(CajaModalComponent, {
      data: structuredClone(params) || {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getCashboxs();
      }
    });
  }

  askToDelete(id: number) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this._cajaUseCase.delete(id).subscribe((response) => {
            if (response.code === '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.tS.toastr({
                type: 'success',
                message: response.message,
              });
              this.getCashboxs();
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  openModalAperturar(params: CashboxList) {
    const modalRef = this._dialogSvc.open(AperturaCajaModalComponent, {
      data: params || {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getCashboxs();
      }
    });
  }

  openModalMovimiento(params: CashboxList) {
    const modalRef = this._dialogSvc.open(ControlCajaModalComponent, {
      data: params || {},
      size: 'xl',
    });
    modalRef.subscribe((result) => {
      if (result) {
        this.getCashboxs();
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }
}
