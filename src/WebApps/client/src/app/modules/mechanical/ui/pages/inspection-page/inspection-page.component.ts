import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '@core/services/shared.service';
import { MECHANICAL_CODE_REPORT } from '@mechanical/domain/enums/mechanical.enum';
import { Pagination, DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';

import { InspectionModalComponent } from './components/inspection-modal/inspection-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { InspectionUseCase } from '@mechanical/application/use-cases/inspection.use-case';
import { finalize } from 'rxjs/operators';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-inspection-page',
  imports: [FormsModule, MatMenuModule, MatIconModule, DataGrid, Button],
  templateUrl: './inspection-page.component.html',
})
export class InspectionPageComponent implements OnInit {
  sharedSvc = inject(SharedService);
  private _inspectionUseCase = inject(InspectionUseCase);
  private _dialogSvc = inject(DialogService);

  dataSource: any[] = [];
  dataSearch = {};
  isLoadingResults = signal(false);

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index', width: '60px', sortable: false },
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Cliente/Conductor', field: 'businessName', sortable: true },
    { header: 'Placa', field: 'licensePlate', sortable: true },
    { header: 'Marca', field: 'brand', sortable: true },
    { header: 'Tipo', field: 'vehicleType', sortable: true },
    { header: 'Kilometraje', field: 'mileage', sortable: true },
    { header: 'Combustible', field: 'fuellevel', sortable: true },
  ];

  pagination = signal(new Pagination());

  refresh() {
    this.getInspections();
  }

  openModal(id: number, supportId: number) {
    this._dialogSvc.open(InspectionModalComponent, {
      size: 'xl',
      data: {
        inspectionId: id,
        supportId,
      },
    });
  }

  getInspections() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      status: 1,
    };

    this.isLoadingResults.set(true);
    this._inspectionUseCase
      .getAll(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.dataSource = response;
        if (this.dataSource.length > 0) {
          this.pagination().totalRecords = this.dataSource[0].totalRecords;
        }
      });
  }

  ngOnInit(): void {
    this.getInspections();
  }

  pageChanged(): void {
    this.getInspections();
  }

  changePageSize(): void {
    this.pagination().pageIndex = 1;
    this.getInspections();
  }

  getReport(item: any) {
    const format = 'pdf';
    const dataParams = { inspectionId: item.id, tipo: 1 };
    const params = {
      hasService: false,
      hasIdUsuarioRol: true,
      reportParams: JSON.stringify({
        hasParams: true,
        codigo: MECHANICAL_CODE_REPORT.MI,
        codEstab: item.codEstab,
        format,
        additionalParams: [],
      }),
      dataParams: JSON.stringify(dataParams),
    };

    this.sharedSvc.getReport({ data: params, format: 'pdf' });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
