import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService, DataGridColumn } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { CategoryRead } from '@inventory/data/models/category.model';
import { CATEGORY_SERVICE } from '@inventory/data/inventory-token';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPage implements OnInit {
  list = signal<CategoryRead[]>([]);
  isLoadingResults = signal(false);

  private categorySvc = inject(CATEGORY_SERVICE);
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
      field: 'siglas',
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
      formatter: (rowData: CategoryRead) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    // TODO: Implement category add modal
    console.log('Add category');
  }

  edit(data: CategoryRead): void {
    // TODO: Implement category edit modal
    console.log('Edit category', data);
  }

  getCategories(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.categorySvc.getAll(params).subscribe({
      next: (categories: CategoryRead[]) => {
        this.isLoadingResults.set(false);
        this.list.set(categories);
        this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  refresh(): void {
    this.getCategories();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getCategories();
  }

  async askToDelete(data: CategoryRead): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>¿Está seguro/a de eliminar esta Categoría ahora?</small>`,
        confirmButtonText: 'Sí, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        // TODO: Implement delete/update status functionality
        console.log('Delete category', data);
        this.tS.info({ message: 'Funcionalidad de eliminación pendiente de implementar' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  exportToExcel(): void {
    const results = this.list().map((item: CategoryRead) => {
      return {
        idFamilia: item.idFamilia,
        descripcion: item.descripcion,
        siglas: item.siglas,
        estado: item.estado ? 'Activo' : 'Inactivo',
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Categorías');
  }
}
