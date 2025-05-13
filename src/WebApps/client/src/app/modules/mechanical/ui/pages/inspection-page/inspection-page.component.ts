import { CommonModule } from '@angular/common';
import {Component, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '@core/services/shared.service';
import { MECHANICAL_CODE_REPORT } from '@mechanical/domain/enums/mechanical.enum';
import {MatPagination} from '@shared/models/pagination.model';

import { InspectionModalComponent } from './components/inspection-modal/inspection-modal.component';
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {PageEvent} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {InspectionUseCase} from "@mechanical/application/use-cases/inspection.use-case";
import {finalize} from "rxjs/operators";
import {DialogService} from "@core/services/dialog.service";

@Component({
    selector: 'app-inspection-page',
    imports: [
        CommonModule,
        FormsModule,
      MatMenuModule,
      MatIconModule,
      MatButtonModule,
      MatDynamicTableComponent
    ],
    templateUrl: './inspection-page.component.html'
})
export class InspectionPageComponent {
  sharedSvc = inject(SharedService);
  private _inspectionUseCase = inject(InspectionUseCase);
  private _dialogSvc = inject(DialogService)

  dataSource: any[] = [];
  dataSearch = {};
  isLoadingResults = signal(false);

  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'businessName', label: 'Cliente/Conductor', type: 'string' },
    { key: 'licensePlate', label: 'Placa', type: 'string' },
    { key: 'brand', label: 'Marca', type: 'string' },
    { key: 'vehicleType', label: 'Tipo', type: 'string' },
    { key: 'mileage', label: 'Kilometraje', type: 'string' },
    { key: 'fuellevel', label: 'Combustible', type: 'string' },

  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  refresh(){
    this.getInspections()
  }

  openModal(id: number, supportId: number) {
    this._dialogSvc.open(InspectionModalComponent, {
      size: 'xl',
      data: {
        inspectionId: id,
        supportId,
      }
    });
  }

  getInspections() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      status: 1,
    };

    this.isLoadingResults.set(true);
    this._inspectionUseCase.getAll(params)
      .pipe(
        finalize(()=>this.isLoadingResults.set(false))
      )
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
    let format = 'pdf';
    let dataParams = { inspectionId: item.id, tipo: 1 };
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
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }


}
