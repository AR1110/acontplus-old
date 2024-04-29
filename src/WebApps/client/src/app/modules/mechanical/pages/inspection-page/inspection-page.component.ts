import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { InspectionService } from '@modules/mechanical/services/inspection.service';
import { Pagination } from '@shared/models/pagination.model';
import { InspectionModalComponent } from './components/inspection-modal/inspection-modal.component';
import { NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTableModule } from '@angular/material/table';
import { MECHANICAL_CODE_REPORT } from '@modules/mechanical/enums/mechanical.enum';
import { SharedService } from '@core/services/shared.service';

@Component({
  selector: 'app-inspection-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPagination,
    FontAwesomeModule,
    NgbDropdownModule,
    MatTableModule
  ],
  templateUrl: './inspection-page.component.html',
})
export class InspectionPageComponent {
  private inspectionSvc = inject(InspectionService);
  private modalSvc = inject(ModalService)
  sharedSvc = inject(SharedService)


  displayedColumns = ['position', 'op', 'cliente-conductor', 'placa', 'marca', 'tipo', 'kilometraje', 'combustible'];

  pagination = new Pagination();
  dataSource: any[] = [];

  dataSearch = {

  }

  openModal(id: number, supportId: number) {
    let modalRef = this.modalSvc.open(InspectionModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      inspectionId: id,
      supportId
    }
  }

  getInspections() {
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      status: 1
    }
    showLoader();
    this.inspectionSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader();
        this.dataSource = response;
        if(this.dataSource.length>0){
          this.pagination.totalRecords = this.dataSource[0].totalRecords;
        }

      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
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
    let dataParams = { inspectionId: item.id };
    const params = {
      hasService: false,
      hasIdUsuarioRol: true,
      reportParams: JSON.stringify({
        hasParams: true,
        codigo: MECHANICAL_CODE_REPORT.MI,
        codEstab: item.codEstab,
        format,
        additionalParams: []
      }),
      dataParams: JSON.stringify(dataParams)
    };

    this.sharedSvc.getReport(params, 'pdf', true)

  }

}
