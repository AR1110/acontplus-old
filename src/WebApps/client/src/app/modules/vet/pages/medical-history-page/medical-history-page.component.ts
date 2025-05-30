import { Component, inject, ViewChild, OnInit, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MedicalHistoryModalComponent } from '@modules/vet/pages/medical-history-page/medical-history-modal/medical-history-modal.component';
import { MedicalHistoryService } from '@modules/vet/services/medical-history.service';
import { isApiResponse } from '@core/models/api-response';
import { MedicalHistory } from '@modules/vet/models/medical-history.model';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';

import { MatPagination } from '@shared/models/pagination.model';
import { isValidField } from '@core/utils/utils';
import { GroupedEstab } from '@core/models/estab.model';
import { Pet } from '@modules/vet/models/pet.model';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { SharedService } from '@core/services/shared.service';
import { DialogService } from '@core/services/dialog.service';
import { MatIcon } from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-medical-history-page',
  imports: [
    BreadcrumbComponent,
    MatIcon,
    MatDynamicCardComponent,
    MatPaginatorModule,
    FormsModule,
    MatMenuModule,
    MatDynamicTableComponent,
    ThemeButtonComponent,
  ],
  templateUrl: './medical-history-page.component.html',
  styles: ``,
})
export class MedicalHistoryPageComponent implements OnInit {
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
  establecimientos: GroupedEstab[] = [];
  medicalHistories: MedicalHistory[] = [];
  searching = false;
  private readonly medicalHistoryService = inject(MedicalHistoryService);
  private readonly modalService = inject(DialogService);
  private readonly sharedService = inject(SharedService);
  private readonly tS = inject(ToasterService);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'customer', label: 'Cliente', type: 'string' },
    { key: 'petName', label: 'Mascota', type: 'string' },
    { key: 'date', label: 'Fecha', type: 'string' },
    { key: 'age', label: 'Edad', type: 'string' },
    { key: 'weight', label: 'Peso', type: 'string' },
    { key: 'observations', label: 'Observación', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

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
      console.log(response);
      if (isApiResponse(response) && response.code == '1') {
        const { estabs } = JSON.parse(response.payload as string);
        this.establecimientos = estabs;
        const dataEstab = this.establecimientos.find(
          (estab) => estab.defaultEstab
        );
        if (dataEstab) {
          this.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
          this.loadHistories();
        }
      }
    });
  }

  refresh() {
    this.loadHistories();
  }

  loadHistories() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };

    let historiesModified: any[] = [];
    const clonedParams = Object.assign(params, this.dataSearch);
    this.medicalHistoryService.get(clonedParams).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { medicalHistories } = JSON.parse(response.payload as string);
        this.medicalHistories = medicalHistories;
        historiesModified =
          medicalHistories &&
          medicalHistories.map((pet: any, index: number) => ({
            ...pet,
            index: index + 1,
          }));
      }
      this.dataSource = new MatTableDataSource(historiesModified);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.pagination.update((pag) => {
          return {
            ...pag,
            totalRecords:
              historiesModified.length > 0
                ? historiesModified[0].totalRecords
                : 0,
          };
        });
      });
    });
  }

  ngOnInit(): void {
    this.initialLoad();
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.idEstablecimiento)) {
      const dataEstab = this.establecimientos.find(
        (estab) => estab.idEstablecimiento === this.dataSearch.idEstablecimiento
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
    const modalRef = this.modalService.open(MedicalHistoryModalComponent, {
      size: 'xl',
      data: this.data.id > 0 ? this.data : {},
    });

    modalRef.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.loadHistories();
      }
      if (this.data.id > 0) {
        this.data = {} as MedicalHistory;
      }
    });
  }

  search(textSearch: string) {
    this.dataSearch.textSearch = textSearch;
    this.loadHistories();
  }

  onReport(element: MedicalHistory) {
    const codEstab = this.establecimientos.find(
      (x) => (x.idEstablecimiento = this.dataSearch.idEstablecimiento)
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
