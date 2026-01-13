import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DataGrid, Pagination, Button, DataGridColumn} from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SubCategoryModalDirective } from '@inventory/ui/directives/sub-category.directive';
import { SUB_CATEGORY_SERVICE } from '@inventory/data/inventory-token';
import { SubCategoryListDto } from '@inventory/data/models/sub-category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategory-page',
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatIconModule,
    SubCategoryModalDirective,
    DataGrid,
    Button,
  ],
  templateUrl: './sub-category-page.html',
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryPage implements OnInit {
  pagination = signal(new Pagination());
  list = signal<SubCategoryListDto[]>([]);
  isLoadingResults = signal(false);

  private subCategorySvc = inject(SUB_CATEGORY_SERVICE);
  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);

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
      header: 'Categoría',
      field: 'nombreFamilia',
      sortable: true,
    },
    {
      header: 'Imagen',
      field: 'imageUrl',
      width: '100px',
      sortable: false,
      type: 'image',
    },
    {
      header: 'Código',
      field: 'codigo',
      sortable: true,
    },
    {
      header: 'Sigla',
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
      formatter: (rowData: SubCategoryListDto) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  onResultModal(_$event: any) {
    this.refresh();
  }

  getSubcategories() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.subCategorySvc.getAll(params).subscribe({
      next: (categories) => {
        this.isLoadingResults.set(false);
        this.list.set(categories);

        this.pageCount = this.list().length > 0 ? this.list()[0].totalRecords : 0;
      },
      error: (err) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit() {
    this.getSubcategories();
  }

  refresh() {
    this.getSubcategories();
  }
  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;

    this.getSubcategories();
  }

  async askToUpdateStatus(obj: SubCategoryListDto) {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta subfamilia ahora?</small>`,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.subCategorySvc.updateStatus(obj.id).subscribe((response) => {
          if (response.code === '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.tS.show({
              type: 'success',
              message: response.message,
            });
            this.getSubcategories();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  exportToExcel() {
    const results = this.list().map((category: SubCategoryListDto) => {
      return {
        descripcion: category.descripcion,
        siglas: category.siglas,
        codigo: category.codigo,
        nombreFamilia: category.nombreFamilia,
        ultimoSecuencial: category.ultimoSecuencial,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de SubCategorias');
  }
}
