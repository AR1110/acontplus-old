import { AddEditCreditTime } from '@modules/config/ui/credit-time/add-edit-credit-time/add-edit-credit-time';
import { DeleteCreditTimeUseCase } from '@modules/config/application/use-cases/credit-time/delete-credit-time.use-case';
import { ListCreditTimeUseCase } from '@modules/config/application/use-cases/credit-time/list-credit-time.use-case';
import { Button, DataGrid, DataGridColumn, AdvancedDialogService } from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CreditTimeList } from '@modules/config/data/models/tiempo-credito.model';
import { Component, inject, signal, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NotificationService } from '@acontplus/ng-notifications';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-time',
  imports: [BreadcrumbComponent, DataGrid, Button],
  templateUrl: './credit-time-page.html',
  styles: ``,
})
export class CreditTimePage implements OnInit {
  private $listUseCase = inject(ListCreditTimeUseCase);
  private $deleteUseCase = inject(DeleteCreditTimeUseCase);
  private dialogSvc = inject(AdvancedDialogService);
  private tS = inject(NotificationService);

  dataSource = signal<CreditTimeList[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#', width: '60px' },
    { field: 'op', header: 'Op.' },
    { field: 'descripcion', header: 'Descripción' },
    { field: 'diasCredito', header: 'Día Crédito' },
    { field: 'numeroCuota', header: 'Nro. Cuota' },
    { field: 'nombreEntrada', header: 'Entrada' },
    { field: 'nombreGestion', header: 'Modulo' },
    { field: 'tipoCredito', header: 'Tipo Crédito' },
    { field: 'nombreEstado', header: 'Estado' },
  ];

  page = 0;
  pageSize = 10;
  pageCount = 0;
  private getList() {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    this.$listUseCase.execute(params).subscribe((response) => {
      this.dataSource.set(response.data);
      this.pageCount = response.totalRecords || 0;
    });
  }

  refresh() {
    this.getList();
  }

  async openModalAddUpdate(item?: CreditTimeList) {
    const isEdit = !!item;
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: AddEditCreditTime,
        title: isEdit ? 'Editar Tiempo Crédito' : 'Nuevo Tiempo Crédito',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data: structuredClone(item) || {},
      },
      {
        size: 'sm',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  ngOnInit() {
    this.refresh();
  }

  async askToDelete(item: CreditTimeList) {
    try {
      const { isConfirmed } = await Swal.fire({
        html: `<small>Esta acción eliminará el registro. ¿Desea continuar?</small>`,
        icon: 'warning',
        confirmButtonText: 'Sí, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.$deleteUseCase
          .execute({ idTiempoCredito: item.idTiempoCredito })
          .subscribe((response) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
              this.refresh();
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.refresh();
  }
}
