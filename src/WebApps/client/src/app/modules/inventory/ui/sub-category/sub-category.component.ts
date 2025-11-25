import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SubCategoryModalDirective } from '@inventory/ui/directives/sub-category.directive';
import { SubCategoryService } from '@inventory/data/services/sub-category.service';
import { Pagination } from '@acontplus/ng-components';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategory',
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
    SubCategoryModalDirective,
  ],
  templateUrl: './sub-category.component.html',
})
export class SubCategoryComponent implements OnInit {
  pagination = signal(new Pagination());
  visibleColumns: string[] = [
    'index',
    'op',
    'nombreFamilia',
    'img',
    'code',
    'siglas',
    'description',
    'estado',
  ];
  dataSource = new MatTableDataSource<any>();
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private subCategorySvc = inject(SubCategoryService);
  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);

  onResultModal($event: any) {
    this.refresh();
  }

  getSubcategories() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    if (this.isLoadingResults) return;

    this.isLoadingResults = true;

    this.subCategorySvc.getAll(params).subscribe({
      next: (categories) => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(categories);
        //  this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.dataSource.data.length > 0) {
          this.pagination.update(
            (e) => new Pagination(e.pageIndex, e.pageSize, this.dataSource.data[0].totalRecords),
          );
        }
      },
      error: (err) => {
        this.isLoadingResults = false;
        console.log(err);
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
    this.pageEvent = e;
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.getSubcategories();
  }

  async askToUpdateStatus(obj: any) {
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
        this.subCategorySvc.updateStatus(obj.idSubFamilia).subscribe((response) => {
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
      console.log(error);
    }
  }

  exportToExcel() {
    const results = this.dataSource.data.map((category: any) => {
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
