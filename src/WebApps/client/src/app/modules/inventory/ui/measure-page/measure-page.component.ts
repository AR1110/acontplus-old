import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { MeasureAddEditDirective } from '@inventory/ui/directives/measure-add-edit.directive';
import { MeasureRead } from '@inventory/core/domain/measure.model';
import { MeasureService } from '@inventory/services/measure.service';
import { MatPagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-measure-page',
    imports: [
        BreadcrumbComponent,
        MeasureAddEditDirective,
        PrimaryStatusPipe,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        CustomTableContainerComponent,
    ],
    templateUrl: './measure-page.component.html',
    styles: ``
})
export class MeasurePageComponent {
  measureSvc = inject(MeasureService);
  pagination = signal(new MatPagination());
  displayedColumns: string[] = ['index', 'op', 'code', 'description', 'estado'];
  dataSource = signal<MeasureRead[]>([]);
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);

  getMeasures() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this.isLoadingResults = true;
    this.measureSvc.getAll(params).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.dataSource.set(response);
        if (this.dataSource().length > 0) {
          this.pagination.update((e) => {
            return {
              ...e,
              totalRecords: this.dataSource()[0].totalRecords,
            };
          });
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
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.getMeasures();
  }

  askToDelete(data: any) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Medida ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.measureSvc.updateStatus(data.idMedida).subscribe((response) => {
            if (response.code == '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              this.tS.toastr({
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
        idMedida: item.idMedida,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Medidas');
  }
}
