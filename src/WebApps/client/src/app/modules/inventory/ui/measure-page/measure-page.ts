import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService,DataGridColumn } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { MEASURE_SERVICE } from '@inventory/data/inventory-token';
import { MeasureRead } from '@inventory/data/models/measure.model';
import { MeasureAddEdit } from '@inventory/ui/measure-page/measure-add-edit/measure-add-edit';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-measure-page',
  templateUrl: './measure-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurePage implements OnInit {
  list = signal<MeasureRead[]>([]);
  isLoadingResults = signal(false);

  private measureService = inject(MEASURE_SERVICE);
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
      header: 'Estado',
      field: 'estado',
      sortable: true,
      type: 'boolean',
      formatter: (rowData: MeasureRead) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    void this.openMeasureModal();
  }

  edit(data: MeasureRead): void {
    void this.openMeasureModal(data);
  }

  private async openMeasureModal(data?: MeasureRead): Promise<void> {
    const isEdit = !!data;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: MeasureAddEdit,
        title: isEdit ? 'Editar Medida' : 'Nueva Medida',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data: data ?? {},
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

  getMeasures(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.measureService.getAll(params).subscribe({
      next: (response: MeasureRead[]) => {
        this.isLoadingResults.set(false);
        this.list.set(response);
        this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getMeasures();
  }

  refresh(): void {
    this.getMeasures();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getMeasures();
  }

  async askToDelete(data: MeasureRead): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Medida ahora?</small>`,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.measureService
          .updateStatus(data.idMedida)
          .subscribe((response: { code: string; message: string }) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
              this.getMeasures();
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  exportToExcel(): void {
    const results = this.list().map((item: MeasureRead) => {
      return {
        idMedida: item.idMedida,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Medidas');
  }
}
