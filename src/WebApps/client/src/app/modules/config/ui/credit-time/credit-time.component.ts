import { AddEditCreditTimeComponent } from '@modules/config/ui/credit-time/add-edit-credit-time/add-edit-credit-time.component';
import { DeleteCreditTimeUseCase } from '@modules/config/application/use-cases/credit-time/delete-credit-time.use-case';
import { ListCreditTimeUseCase } from '@modules/config/application/use-cases/credit-time/list-credit-time.use-case';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';

import { Button, DynamicCard } from '@acontplus/ng-components';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CreditTimeList } from '@modules/config/domain/models/tiempo-credito.model';
import { SvgIconComponent } from '@shared/components/svg-icon/svg-icon.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Component, inject, signal, OnInit } from '@angular/core';
import { Pagination } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { PageEvent } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-time',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    MatButton,
    MatIcon,
    MatIconButton,
    MatDynamicTableComponent,
    SvgIconComponent,
    ThemeButtonComponent,
  ],
  templateUrl: './credit-time.component.html',
  styles: ``,
})
export class CreditTimeComponent implements OnInit {
  private $listUseCase = inject(ListCreditTimeUseCase);
  private $deleteUseCase = inject(DeleteCreditTimeUseCase);
  private _dialogSvc = inject(DialogService);

  dataSource = signal<CreditTimeList[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'diasCredito', label: 'Día Crédito', type: 'string' },
    { key: 'numeroCuota', label: 'Nro. Cuota', type: 'string' },
    { key: 'nombreEntrada', label: 'Entrada', type: 'string' },
    { key: 'nombreGestion', label: 'Modulo', type: 'string' },
    { key: 'tipoCredito', label: 'Tipo Crédito', type: 'string' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
  ];

  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  pagination = signal(new Pagination());
  private getList() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this.$listUseCase.execute(params).subscribe((response) => {
      this.dataSource.set(response.data);
      this.pagination.update((p) => new Pagination(p.pageIndex, p.pageSize, response.totalRecords));
    });
  }

  refresh() {
    this.getList();
  }

  openModalAddUpdate(item?: CreditTimeList) {
    const ref = this._dialogSvc.open(AddEditCreditTimeComponent, {
      data: structuredClone(item) || {},
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  ngOnInit() {
    this.refresh();
  }

  askToDelete(item: CreditTimeList) {
    Swal.fire({
      html: `<small>Esta acción eliminará el registro. ¿Desea continuar?</small>`,
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.$deleteUseCase
          .execute({ idTiempoCredito: item.idTiempoCredito })
          .subscribe((response) => {
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
              setTimeout(() => {
                this.refresh();
              }, 1000);
            }
          });
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
