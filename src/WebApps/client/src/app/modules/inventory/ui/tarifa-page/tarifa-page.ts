import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService,DataGridColumn } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { TARIFA_SERVICE } from '@inventory/data/inventory-token';
import { TarifaEdit } from '@inventory/ui/tarifa-page/tarifa-edit/tarifa-edit';

interface Tarifa {
  idTarifa: number;
  codigo: string;
  descripcion: string;
  predeterminada: boolean;
  ventaPorMayor: boolean;
  estado: boolean;
  totalRecords?: number;
}

@Component({
  selector: 'app-tarifa-page',
  templateUrl: './tarifa-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarifaPage implements OnInit {
  list = signal<Tarifa[]>([]);
  isLoadingResults = signal(false);

  private tarifaSvc = inject(TARIFA_SERVICE);
  private tS = inject(NotificationService);
  private sharedSvc = inject(SharedService);
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
      header: 'Código',
      field: 'codigo',
      sortable: true,
    },
    {
      header: 'Descripción',
      field: 'descripcion',
      sortable: true,
    },
    {
      header: 'Predeterminado',
      field: 'predeterminada',
      sortable: true,
      formatter: (rowData: Tarifa) => {
        return rowData.predeterminada ? 'SI' : 'NO';
      },
    },
    {
      header: 'Venta Por Mayor',
      field: 'ventaPorMayor',
      sortable: true,
      formatter: (rowData: Tarifa) => {
        return rowData.ventaPorMayor ? 'SI' : 'NO';
      },
    },
    {
      header: 'Estado',
      field: 'estado',
      sortable: true,
      formatter: (rowData: Tarifa) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  edit(data: Tarifa): void {
    void this.openTarifaModal(data);
  }

  private async openTarifaModal(data: Tarifa): Promise<void> {
    const ref = await this.dgSvc.openInWrapper(
      {
        component: TarifaEdit,
        title: 'Editar Tarifa',
        icon: 'edit',
        showCloseButton: true,
        data: data,
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

  getTarifas(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.tarifaSvc.getAll(params).subscribe({
      next: (response: { tarifas: Tarifa[] }) => {
        this.isLoadingResults.set(false);
        this.list.set(response.tarifas);
        this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getTarifas();
  }

  refresh(): void {
    this.getTarifas();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTarifas();
  }

  exportToExcel(): void {
    const results = this.list().map((item: Tarifa) => {
      return {
        codigo: item.codigo,
        descripcion: item.descripcion,
        predeterminada: item.predeterminada ? 'SI' : 'NO',
        ventaPorMayor: item.ventaPorMayor ? 'SI' : 'NO',
        estado: item.estado ? 'Activo' : 'Inactivo',
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Tarifas');
  }
}
