import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ModelAddEditDirective } from '@inventory/ui/directives/model-add-edit.directive';
import { Pagination } from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { INVENTARIO_MODELO_SERVICE } from '@inventory/data/inventory-token';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-inv-model-page',
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    MatDynamicTableComponent,
    ModelAddEditDirective,
  ],
  templateUrl: './inv-model-page.html',
  styles: ``,
})
export class InvModelPage implements OnInit {
  private modeloService = inject(INVENTARIO_MODELO_SERVICE);
  pagination = signal(new Pagination());
  isLoadingResults = signal(false);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'marca', label: 'Marca', type: 'string' },
    { key: 'codigo', label: 'Código', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<any>([]);

  getMeasures() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);
    this.modeloService
      .getAll(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource(response.data);
        if (this.dataSource.data.length > 0) {
          this.pagination.update(
            (e) => new Pagination(e.pageIndex, e.pageSize, this.dataSource.data[0].totalRecords),
          );
        }
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
        html: `<small>Esta seguro/a de eliminar esta Modelo ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.modeloService.updateStatus(data.idModelo).subscribe((response) => {
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
    const results = this.dataSource.data.map((item: any) => {
      return {
        marca: item.marca,
        descripcion: item.descripcion,
        codigo: item.codigo,
      };
    });

    this.sharedSvc.exportToExcel(results, 'Listado de Modelos');
  }
}
