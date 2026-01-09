import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { INVENTARIO_MODELO_SERVICE } from '@inventory/data/inventory-token';
import { ModelAddEdit } from './model-add-edit/model-add-edit';
import Swal from 'sweetalert2';

interface InvModel {
  idModelo: number;
  idMarca: number;
  marca: string;
  codigo: string;
  descripcion: string;
  estado: boolean;
  nomEstado: string;
  totalRecords?: number;
}

@Component({
  selector: 'app-inv-model-page',
  templateUrl: './inv-model-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvModelPage implements OnInit {
  list = signal<InvModel[]>([]);
  isLoadingResults = signal(false);

  private modeloService = inject(INVENTARIO_MODELO_SERVICE);
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
      header: 'Marca',
      field: 'marca',
      sortable: true,
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
      field: 'nomEstado',
      sortable: true,
      formatter: (rowData: InvModel) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.nomEstado || (rowData.estado ? 'Activo' : 'Inactivo');
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    void this.openModelModal();
  }

  edit(data: InvModel): void {
    void this.openModelModal(data);
  }

  private async openModelModal(data?: InvModel): Promise<void> {
    const isEdit = !!data;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: ModelAddEdit,
        title: isEdit ? 'Editar Modelo' : 'Nuevo Modelo',
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

  getModels(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.modeloService.getAll(params).subscribe({
      next: (response: { data: InvModel[] }) => {
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
    this.getModels();
  }

  refresh(): void {
    this.getModels();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getModels();
  }

  async askToDelete(data: InvModel): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar este Modelo ahora?</small>`,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.modeloService
          .updateStatus(data.idModelo)
          .subscribe((response: { code: string; message: string }) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
              this.getModels();
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  exportToExcel(): void {
    const results = this.list().map((item: InvModel) => {
      return {
        marca: item.marca,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Modelos');
  }
}
