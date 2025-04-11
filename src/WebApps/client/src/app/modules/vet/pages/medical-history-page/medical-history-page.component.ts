import { Component, inject, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { MedicalHistoryModalComponent } from '@modules/vet/pages/medical-history-page/medical-history-modal/medical-history-modal.component';
import { MedicalHistoryService } from '@modules/vet/services/medical-history.service';
import { isApiResponse } from '@core/models/api-response';
import { MedicalHistory } from '@modules/vet/models/medical-history.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Pagination } from '@shared/models/pagination.model';
import { FormsModule } from '@angular/forms';
import { isValidField } from '@core/utils/utils';
import { GroupedEstab } from '@core/models/estab.model';
import { MatInput } from '@angular/material/input';
import { Pet } from '@modules/vet/models/pet.model';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { SharedService } from '@core/services/shared.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
    selector: 'app-medical-history-page',
  imports: [
    BreadcrumbComponent,
    FaIconComponent,
    FormsModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCellDef,
    MatHeaderCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatNoDataRow,
    MatPaginator,
    MatRow,
    MatInput,
    NgbDropdownModule,
    MatCardContent,
    MatCard,
  ],
    templateUrl: './medical-history-page.component.html',
    styles: ``
})
export class MedicalHistoryPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  colorToggle: ThemePalette = 'accent';
  visibleColumns: string[] = [
    'op',
    'position',
    'customer',
    'petName',
    'date',
    'age',
    'weight',
    'observations',
  ];
  dataSource = new MatTableDataSource<MedicalHistory>();
  dataSearch = {
    idEstablecimiento: 0,
    textSearch: '',
  };
  data = {} as MedicalHistory;
  establecimientos: Array<GroupedEstab> = [];
  medicalHistories: MedicalHistory[] = [];
  pagination = new Pagination();
  searching: boolean = false;
  private readonly medicalHistoryService = inject(MedicalHistoryService);
  private readonly modalService = inject(ModalService);
  private readonly sharedService = inject(SharedService);
  private readonly tS = inject(ToasterService);

  applyFilter(event: Event) {
    this.searching = true;
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue && filterValue.length >= 3) {
      this.search(filterValue);
    }
    if (filterValue.length == 0) {
      this.dataSearch.textSearch = '';
      this.loadHistories();
    }
  }

  initialLoad() {
    this.medicalHistoryService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { estabs } = JSON.parse(response.payload as string);
        this.establecimientos = estabs;
        const dataEstab = this.establecimientos.find(
          (estab) => estab.defaultEstab,
        );
        if (dataEstab) {
          this.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
          this.loadHistories();
        }
      }
    });
  }

  loadHistories() {
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
    };

    let historiesModified: any[] = [];
    let clonedParams = Object.assign(params, this.dataSearch);
    this.medicalHistoryService.get(clonedParams).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { medicalHistories } = JSON.parse(response.payload as string);
        this.medicalHistories = medicalHistories;
        historiesModified =
          medicalHistories &&
          medicalHistories.map((pet: any, index: number) => ({
            ...pet,
            position: index + 1,
          }));
      }
      this.dataSource = new MatTableDataSource(historiesModified);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.paginator.pageIndex = this.pagination.pageIndex;
        this.paginator.length =
          historiesModified.length > 0 ? historiesModified[0].totalRecords : 0;
      });
    });
  }

  ngOnInit(): void {
    this.initialLoad();
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.idEstablecimiento)) {
      let dataEstab = this.establecimientos.find(
        (estab) =>
          estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
      );
      this.loadHistories();
    }
  }

  onDelete(item: Pet) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: `Esta seguro de eliminar la mascota ${item.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    }).then((response) => {
      if (response.isConfirmed) {
        this.medicalHistoryService.delete(item.id).subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.loadHistories();
            }
          }
        });
      }
    });
  }

  onEdit(item: MedicalHistory) {
    this.data = item;
    this.onModalOpen();
  }

  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(
      MedicalHistoryModalComponent,
      { size: 'xl', centered: true },
    );
    if (this.data.id > 0) {
      modalRef.componentInstance.data = this.data;
    }
    modalRef.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.loadHistories();
      }
      if (this.data.id > 0) {
        this.data = {} as MedicalHistory;
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.pageIndex = event.pageIndex == 0 ? 1 : event.pageIndex;
    this.loadHistories();
  }

  search(textSearch: string) {
    this.dataSearch.textSearch = textSearch;
    this.loadHistories();
  }

  onReport(element: MedicalHistory) {
    const codEstab = this.establecimientos.find(
      (x) => (x.idEstablecimiento = this.dataSearch.idEstablecimiento),
    )?.codEstab;

    const parameters = {
      dataParams: JSON.stringify({
        id: element.id,
      }),
      reportParams: JSON.stringify({
        codigo: 'RVMH',
        codEstab: codEstab,
        format: 'pdf',
      }),
    };

    this.sharedService.getReport({
      data: parameters,
    });
  }
}
