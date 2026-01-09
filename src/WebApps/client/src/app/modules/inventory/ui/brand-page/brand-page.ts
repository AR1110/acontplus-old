import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { BRAND_HTTP_TOKEN } from '@inventory/data/inventory-token';
import { BrandAddEdit } from './brand-add-edit/brand-add-edit';
import Swal from 'sweetalert2';

interface Brand {
  idMarca: number;
  codigo: string;
  descripcion: string;
  estado: boolean;
  totalRecords?: number;
}

@Component({
  selector: 'app-brand-page',
  templateUrl: './brand-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandPage implements OnInit {
  list = signal<Brand[]>([]);
  isLoadingResults = signal(false);

  private brandService = inject(BRAND_HTTP_TOKEN);
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
      formatter: (rowData: Brand) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    void this.openBrandModal();
  }

  edit(data: Brand): void {
    void this.openBrandModal(data);
  }

  private async openBrandModal(data?: Brand): Promise<void> {
    const isEdit = !!data;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: BrandAddEdit,
        title: isEdit ? 'Editar Marca' : 'Nueva Marca',
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

  onResultModal(_$event: unknown): void {
    this.refresh();
  }

  getBrands(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.brandService.getAll(params).subscribe({
      next: (response: { brands: Brand[] }) => {
        this.isLoadingResults.set(false);
        this.list.set(response.brands);
        this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getBrands();
  }

  refresh(): void {
    this.getBrands();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getBrands();
  }

  async askToDelete(data: Brand): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Marca ahora?</small>`,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.brandService
          .updateStatus(data.idMarca)
          .subscribe((response: { code: string; message: string }) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
              this.getBrands();
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  exportToExcel(): void {
    const results = this.list().map((item: Brand) => {
      return {
        idMarca: item.idMarca,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Marcas');
  }
}
