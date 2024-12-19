import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MECHANICAL_CODE_REPORT } from '@mechanical/domain/enums/mechanical.enum';
import { InspectionService } from '@mechanical/data/inspection/inspection.service';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/models/pagination.model';

import { InspectionModalComponent } from './components/inspection-modal/inspection-modal.component';

@Component({
    selector: 'app-inspection-page',
    imports: [
        CommonModule,
        FormsModule,
        NgbPagination,
        FontAwesomeModule,
        NgbDropdownModule,
        MatTableModule,
    ],
    templateUrl: './inspection-page.component.html'
})
export class InspectionPageComponent {
  sharedSvc = inject(SharedService);
  visibleColumns = [
    'position',
    'op',
    'cliente-conductor',
    'placa',
    'marca',
    'tipo',
    'kilometraje',
    'combustible',
  ];
  pagination = new Pagination();
  dataSource: any[] = [];
  dataSearch = {};
  private inspectionSvc = inject(InspectionService);
  private modalSvc = inject(ModalService);

  openModal(id: number, supportId: number) {
    let modalRef = this.modalSvc.open(InspectionModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.params = {
      inspectionId: id,
      supportId,
    };
  }

  getInspections() {
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      status: 1,
    };

    this.inspectionSvc.getAll(params).subscribe((response) => {
      this.dataSource = response;
      if (this.dataSource.length > 0) {
        this.pagination.totalRecords = this.dataSource[0].totalRecords;
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
    this.pagination.pageIndex = 1;
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
}
