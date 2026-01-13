import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService, DataGridColumn } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { NotificationService } from '@acontplus/ng-notifications';
import { CAJA_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { CashboxList } from '@accounting/data/models/caja';
import CajaModalComponent from '@accounting/ui/caja-page/components/caja-modal/caja-modal.component';
import { AperturaCajaModal } from '@accounting/ui/caja-page/components/apertura-caja-modal/apertura-caja-modal';
import { ControlCajaModal } from '@accounting/ui/caja-page/components/control-caja-modal/control-caja-modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cashbox',
  templateUrl: './caja-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaPage implements OnInit {
  list = signal<CashboxList[]>([]);
  isLoadingResults = signal(false);

  private cajaService = inject(CAJA_HTTP_TOKEN);
  private tS = inject(NotificationService);
  private dgSvc = inject(AdvancedDialogService);

  page = 0;
  pageSize = 10;
  pageCount = 0;

  columns: DataGridColumn[] = [
    {
      header: 'Nro.',
      field: 'index',
      width: '60px',
      sortable: false,
    },
    {
      header: 'Op.',
      field: 'actions',
      sortable: false,
    },
    {
      header: 'Usuario',
      field: 'usuario',
      sortable: true,
    },
    {
      header: 'Descripción',
      field: 'descripcion',
      sortable: true,
    },
    {
      header: 'Turno',
      field: 'turno',
      sortable: true,
    },
    {
      header: 'Actividad',
      field: 'actividad',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'estado',
      sortable: true,
      type: 'boolean',
      formatter: (rowData: CashboxList) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    void this.openCajaModal();
  }

  edit(data: CashboxList): void {
    void this.openCajaModal(data);
  }

  private async openCajaModal(data?: CashboxList): Promise<void> {
    const isEdit = !!data;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: CajaModalComponent,
        title: isEdit ? 'Editar Caja' : 'Nueva Caja',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data: data ?? {},
      },
      {
        size: 'md',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  async openModalAperturar(data: CashboxList): Promise<void> {
    const ref = await this.dgSvc.openInWrapper(
      {
        component: AperturaCajaModal,
        title: 'Aperturar Caja',
        icon: 'lock_open',
        showCloseButton: true,
        data: data,
      },
      {
        size: 'md',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  async openModalMovimiento(data: CashboxList): Promise<void> {
    const ref = await this.dgSvc.openInWrapper(
      {
        component: ControlCajaModal,
        title: 'Movimientos de Caja',
        icon: 'show_chart',
        showCloseButton: true,
        data: data,
      },
      {
        size: 'xl',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }

  getCashboxs(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.cajaService.getAll(params).subscribe({
      next: (response: { data: CashboxList[]; totalRecords: number }) => {
        this.isLoadingResults.set(false);
        this.list.set(response.data);
        this.pageCount = response.totalRecords;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getCashboxs();
  }

  refresh(): void {
    this.getCashboxs();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getCashboxs();
  }

  async askToDelete(data: CashboxList): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.cajaService
          .delete(data.idCaja)
          .subscribe((response: { code: string; message: string }) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
              this.getCashboxs();
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
