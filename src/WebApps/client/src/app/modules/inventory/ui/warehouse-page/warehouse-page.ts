import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { WarehouseList } from '@inventory/data/models/warehouse.model';
import { AddEditWarehouse } from '@inventory/ui/warehouse-page/add-edit-warehouse/add-edit-warehouse';
import Swal from 'sweetalert2';
import { SendMaxWarehousesUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { firstValueFrom } from 'rxjs';
import { WAREHOUSE_SERVICE } from '@inventory/data/inventory-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-warehouse-page',
  templateUrl: './warehouse-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
})
export class WarehouseComponent implements OnInit {
  list = signal<WarehouseList[]>([]);
  isLoadingResults = signal(false);

  private warehouseService = inject(WAREHOUSE_SERVICE);
  private $sendMaxWarehousesUseCase = inject(SendMaxWarehousesUseCase);
  private tS = inject(NotificationService);
  private sharedSvc = inject(SharedService);
  private dgSvc = inject(AdvancedDialogService);

  page = 0;
  pageSize = 25;
  pageCount = 0;

  columns: DataGridColumn[] = [
    {
      header: '#',
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
      header: 'Establecimiento',
      field: 'nomEstab',
      sortable: true,
    },
    {
      header: 'Bodega',
      field: 'descripcion',
      sortable: true,
    },
    {
      header: 'Teléfono',
      field: 'telefono',
      sortable: true,
    },
    {
      header: 'Dirección',
      field: 'direccion',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'nomEstado',
      sortable: true,
      formatter: (rowData: WarehouseList) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.nomEstado || (rowData.estado ? 'Activo' : 'Inactivo');
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    void this.openWarehouseModal();
  }

  edit(data: WarehouseList): void {
    void this.openWarehouseModal(data);
  }

  private async openWarehouseModal(data?: WarehouseList): Promise<void> {
    await firstValueFrom(this.$sendMaxWarehousesUseCase.execute());

    const isEdit = !!data;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: AddEditWarehouse,
        title: isEdit ? 'Editar Bodega' : 'Nueva Bodega',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data: data ? structuredClone(data) : {},
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

  refresh(): void {
    this.getList();
  }

  private getList(): void {
    const dataSearch = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.warehouseService.list(dataSearch).subscribe({
      next: (response: { data: WarehouseList[] }) => {
        this.isLoadingResults.set(false);
        this.list.set(response.data);
        this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getList();
  }

  async askToEnabled(item: WarehouseList): Promise<void> {
    const { isConfirmed } = await Swal.fire({
      title: '<small>Confirmar eliminación</small>',
      html: `<small>¿Está seguro de que desea eliminar la bodega <strong>${item.descripcion}</strong>? Esta acción no se puede deshacer.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (!isConfirmed) return;

    this.warehouseService
      .delete({ idBodega: item.idBodega })
      .subscribe((response: { code: string; message: string }) => {
        if (response.code === '0') {
          this.tS.warning({ message: response.message });
        }
        if (response.code === '1') {
          this.tS.success({ message: response.message });
          this.refresh();
        }
      });
  }

  exportToExcel(): void {
    const results = this.list().map((item: WarehouseList) => {
      return {
        establecimiento: item.nomEstab,
        bodega: item.descripcion,
        telefono: item.telefono,
        direccion: item.direccion,
        estado: item.nomEstado || (item.estado ? 'Activo' : 'Inactivo'),
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Bodegas');
  }
}
