import {
  Component,
  inject,
  signal,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
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
import { MeasureAddEditDirective } from '@inventory/ui/directives/measure-add-edit.directive';
import { MeasureRead } from '@inventory/domain/models/measure.model';
import { Pagination } from '@acontplus/ng-components';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';
import { MEASURE_SERVICE } from '@inventory/tokens/inventory-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-measure-page',
  imports: [
    BreadcrumbComponent,
    MeasureAddEditDirective,
    PrimaryStatusPipe,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
  ],
  templateUrl: './measure-page.component.html',
  styles: ``,
})
export class MeasurePageComponent implements OnInit {
  private measureService = inject(MEASURE_SERVICE);
  pagination = signal(new Pagination());
  visibleColumns: string[] = ['index', 'op', 'code', 'description', 'estado'];
  dataSource = signal<MeasureRead[]>([]);
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
    this.measureService.getAll(params).subscribe({
      next: (response: any) => {
        this.isLoadingResults = false;
        this.dataSource.set(response);
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
      void Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Medida ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.measureService.updateStatus(data.idMedida).subscribe((response) => {
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
        idMedida: item.idMedida,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Medidas');
  }
}
