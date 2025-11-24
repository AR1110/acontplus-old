import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { BrandAddEditDirective } from '@inventory/ui/directives/brand-add-edit.directive';
import { Pagination } from '@acontplus/ng-components';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';
import { BrandUseCase } from '@inventory/domain/usecases/brand.use-case';

@Component({
  selector: 'app-brand-page',
  templateUrl: './brand-page.component.html',
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
    BrandAddEditDirective,
  ],
})
export class BrandPageComponent implements OnInit {
  private _brandUseCase = inject(BrandUseCase);
  pagination = signal(new Pagination());
  visibleColumns: string[] = ['index', 'op', 'code', 'description', 'estado'];
  dataSource = signal<any[]>([]);
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);

  getMeasures() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this.isLoadingResults = true;
    this._brandUseCase.getAll(params).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.dataSource.set(response.brands);
        if (this.dataSource().length > 0) {
          this.pagination.update(
            (e) => new Pagination(e.pageIndex, e.pageSize, this.dataSource()[0].totalRecords),
          );
        }
      },
      error: () => (this.isLoadingResults = false),
    });
  }

  ngOnInit() {
    this.getMeasures();
  }

  refresh() {
    this.getMeasures();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.getMeasures();
  }

  askToDelete(data: any) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Marca ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this._brandUseCase.updateStatus(data.idMarca).subscribe((response) => {
            if (response.code == '0') {
              this.tS.show({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              this.tS.show({
                type: 'success',
                message: response.message,
              });
              this.refresh();
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  exportToExcel() {
    const results = this.dataSource().map((item: any) => {
      return {
        idMarca: item.idMarca,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Marcas');
  }
}
