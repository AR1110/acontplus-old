import { Component, inject, OnInit, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response-legacy';
import { MedicalHistory } from '@modules/vet/models/medical-history.model';
import { MedicalHistoryModalComponent } from '@modules/vet/pages/medical-history-page/medical-history-modal/medical-history-modal.component';
import { MedicalHistoryService } from '@modules/vet/services/medical-history.service';

import { Button, DataGrid, DataGridColumn, Pagination } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { GroupedEstab } from '@core/models/estab.model';
import { DialogService } from '@core/services/dialog.service';
import { SharedService } from '@core/services/shared.service';
import { Pet } from '@modules/vet/models/pet.model';
import Swal from 'sweetalert2';

import { DynamicCard } from '@acontplus/ng-components';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-medical-history-page',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    FormsModule,
    MatMenuModule,
    DataGrid,
    Button,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './medical-history-page.component.html',
  styles: ``,
})
export class MedicalHistoryPageComponent implements OnInit {
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
  dataSource = signal<MedicalHistory[]>([]);
  dataSearch = {
    idEstablecimiento: 0,
    textSearch: '',
  };
  data = {} as MedicalHistory;
  establecimientos = signal<GroupedEstab[]>([]);
  private readonly medicalHistoryService = inject(MedicalHistoryService);
  private readonly modalService = inject(DialogService);
  private readonly sharedService = inject(SharedService);
  private readonly tS = inject(NotificationService);

  columns: DataGridColumn[] = [
    { header: '#', field: 'index', width: '60px', sortable: false },
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Cliente', field: 'customer', sortable: true },
    { header: 'Mascota', field: 'petName', sortable: true },
    { header: 'Fecha', field: 'date', sortable: true },
    { header: 'Edad', field: 'age', sortable: true },
    { header: 'Peso', field: 'weight', sortable: true },
    { header: 'Observación', field: 'observations', sortable: true },
  ];

  pagination = signal(new Pagination());

  // applyFilter(event: Event) {
  //   this.searching = true;
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (filterValue && filterValue.length >= 3) {
  //     this.search(filterValue);
  //   }
  //   if (filterValue.length == 0) {
  //     this.dataSearch.textSearch = '';
  //     this.loadHistories();
  //   }
  // }

  initialLoad() {
    this.medicalHistoryService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { estabs } = JSON.parse(response.payload as string);
        this.establecimientos.set(estabs);
        const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);
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

    const clonedParams = Object.assign(params, this.dataSearch);
    this.medicalHistoryService.get(clonedParams).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { medicalHistories = [] } = JSON.parse(response.payload as string);

        const historiesModified = medicalHistories.map((pet: any, index: number) => ({
          ...pet,
          index: index + 1,
        }));
        this.dataSource.set(historiesModified);
        this.pagination;
        this.pagination.update(
          (r) =>
            new Pagination(
              r.pageIndex,
              r.pageSize,
              this.dataSource().length > 0 ? this.dataSource()[0].totalRecords || 0 : 0,
            ),
        );
      }
    });
  }

  ngOnInit(): void {
    this.initialLoad();
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
            if (response.code == '1') {
              this.tS.success({ message: response.message });
              this.loadHistories();
            } else {
              this.tS.warning({ message: response.message });
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
    const codEstab = this.establecimientos().find(
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

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
