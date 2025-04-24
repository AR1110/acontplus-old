import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';

import {
  MECHANICAL_CODE_REPORT,
  MECHANICAL_STATUS,
} from '@mechanical/domain/enums/mechanical.enum';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPagination } from '@shared/models/pagination.model';
import Swal from 'sweetalert2';

import { InspectionModalComponent } from '../inspection-page/components/inspection-modal/inspection-modal.component';
import { SupportAddEditModalComponent } from './components/support-add-edit-modal/support-add-edit-modal.component';
import { SupportMaintenanceModalComponent } from './components/support-maintenance-modal/support-maintenance-modal.component';
import { formatDateToString } from '@core/utils/date.util';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { PageEvent } from '@angular/material/paginator';
import { SupportUseCase } from '@modules/mechanical/domain/use-cases/support.use-case';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { DialogService } from '@core/services/dialog.service';
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { ConvertDocDialogComponent } from '@mechanical/ui/pages/support-page/components/convert-doc-dialog/convert-doc-dialog.component';
import { CompanyCustomer } from '@customer/core/domain/company-customer';

@Component({
  selector: 'app-support-page',
  imports: [
    CommonModule,
    FormsModule,

    MatTableModule,
    MatCheckboxModule,
    NgbPopoverModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DateRangeSelectionComponent,
    MatDynamicTableComponent,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './support-page.component.html',
})
export class SupportPageComponent {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  @Input() valueStatus: MECHANICAL_STATUS | null = null;
  @Input() supportStatus: any[] = [];

  modalSvc = inject(ModalService);
  dialogSvc = inject(DialogService);
  supportUseCase = inject(SupportUseCase);
  tS = inject(ToasterService);
  sharedSvc = inject(SharedService);

  visibleColumns: string[] = [];

  dataSource: any = [];

  statusDoc = [
    { status: null, description: 'Todos' },
    { status: 0, description: 'En proceso' },
    { status: 1, description: 'Entregado' },
    { status: 2, description: 'Aprobado' },
    { status: 3, description: 'Anulado' },
  ];

  statusTab = MECHANICAL_STATUS;
  dataSearch = {
    ckDate: true,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    customerId: null as number | null,
    licensePlate: null as string | null,
    assigned: false,
    supportStatusId: null as number | null,
  };

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'status', label: 'Estado', type: 'string' },
    { key: 'sequence', label: 'Nro. Doc', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'idCard', label: 'Identificación', type: 'string' },
    { key: 'tradeName', label: 'Cliente/Conductor', type: 'string' },
    { key: 'licensePlate', label: 'Placa', type: 'string' },
    { key: 'userAssigned', label: 'Encargado', type: 'string' },
    { key: 'obs', label: 'Obs.', type: 'string' },
    {
      key: 'entregar',
      label: 'Entregar',
      type: 'template',
      templateOutlet: null,
    },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  isLoadingResults = false;

  openModal(id?: number) {
    const modalRef = this.dialogSvc.open(SupportAddEditModalComponent, {
      size: 'xl',
      data: {
        id,
      },
    });
    modalRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') {
        this.getSupports();
      }
    });
  }

  onChangeRequiredDate(value: boolean) {
    this.dataSearch.ckDate = value;
    this.getSupports();
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getSupports();
  }

  //Customer
  searchEmptyCompanyCustomer() {
    this.dataSearch.customerId = null;
    this.getSupports();
  }

  onCustomerSelected(data: CompanyCustomer) {
    this.dataSearch.customerId = data.customerId;
    this.getSupports();
  }

  refresh() {
    this.getSupports();
  }

  getSupports() {
    try {
      /**
       * si status es 0 la pagina support-page carga en dasboard
       */

      let params = {
        ckDate: this.dataSearch.ckDate,
        pageIndex: this.pagination().pageIndex + 1,
        pageSize: this.pagination().pageSize,
        supportStatusId: this.dataSearch.supportStatusId,
        fromDate: this.dataSearch.fromDate,
        toDate: this.dataSearch.toDate,
        customerId: this.dataSearch.customerId,
        licensePlate: isValidField(this.dataSearch.licensePlate),
      };
      this.dataSource = [];
      this.isLoadingResults = true;
      this.supportUseCase
        .getAll(params)
        .pipe(finalize(() => (this.isLoadingResults = false)))
        .subscribe((response) => {
          this.dataSource = response;
          if (this.dataSource.length > 0) {
            this.pagination().totalRecords = this.dataSource[0].totalRecords;
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    let dataStatus = this.supportStatus.find(
      (s) => this.valueStatus === s.code,
    );

    if (dataStatus) {
      this.dataSearch.supportStatusId = dataStatus.id;
    } else {
      this.supportStatus.unshift({
        id: null,
        name: 'TODOS',
      });
      let dataStatus = this.supportStatus.find(
        (s) => s.code === MECHANICAL_STATUS.PENDIENTE,
      );
      this.dataSearch.supportStatusId = dataStatus?.id;
    }

    // this.dataSearch.supportStatusId = this.supportStatusId;

    if (this.valueStatus === MECHANICAL_STATUS.DASHBOARD) {
      this.visibleColumns = [
        'position',
        'op',
        'estado',
        'secuencia',
        'fechaEmision',
        'placa',
        'identificacion',
        'cliente-conductor',
        'encargado',
        'obs',
        'entregar',
      ];
    } else {
      this.visibleColumns = [
        'position',
        'op',
        'secuencia',
        'fechaEmision',
        'placa',
        'identificacion',
        'cliente-conductor',
        'encargado',
        'obs',
        'estado',
        'entregar',
      ];
    }

    this.getSupports();
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }

  pageChanged(): void {
    this.getSupports();
  }

  changePageSize(): void {
    this.pagination().pageIndex = 1;
    this.getSupports();
  }

  askToDelete(id: number) {
    try {
      Swal.fire({
        // title: "Are you sure?",
        text: '¿Estás seguro de anular este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.supportUseCase.remove(id).subscribe((response) => {
            if (response.code === '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.tS.toastr({
                type: 'success',
                message: response.message,
              });
              this.getSupports();
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  openMaintenance(id: number) {
    let modalRef = this.modalSvc.open(SupportMaintenanceModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.params = {
      id,
    };
    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.getSupports();
      }
    });
  }

  openModalInspection(id: number) {
    let modalRef = this.modalSvc.open(InspectionModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.params = {
      supportId: id,
    };

    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.getSupports();
      }
    });
  }

  askToConvertToDoc(id: number) {
    this.supportUseCase.getConvertToAprobDoc(id).subscribe({
      next: (response) => {
        let dialogRef = this.dialogSvc.open(ConvertDocDialogComponent, {
          size: 'lg',
          data: response,
        });

        dialogRef.subscribe((result) => {
          if (result && typeof result === 'object') {
            this.getSupports();
          }
        });
      },
    });
  }

  // For report
  getReport(item: any) {
    let format = 'pdf';
    let dataParams = { supportId: item.id, tipo: 1 };
    const params = {
      reportParams: JSON.stringify({
        hasParams: true,
        codigo: MECHANICAL_CODE_REPORT.MS,
        codEstab: item.codEstab,
        format,
        additionalParams: [],
      }),
      hasService: false,
      hasIdUsuarioRol: true,
      dataParams: JSON.stringify(dataParams),
    };

    this.sharedSvc.getReport({ data: params, format: 'pdf' });
  }

  //Status Support
  putState(id: number) {
    let supportStatusId = this.supportStatus.find(
      (st) => st.code === MECHANICAL_STATUS.POR_ENTREGAR,
    )?.id;
    if (!(supportStatusId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: `No se encontró el estado ${supportStatusId}`,
      });
      return;
    }
    try {
      Swal.fire({
        // title: "Are you sure?",
        text: '¿Estás seguro de Entregar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.supportUseCase
            .putState(id, supportStatusId)
            .subscribe((response) => {
              if (response.code === '0') {
                this.tS.toastr({
                  type: 'warning',
                  message: response.message,
                });
              }
              if (response.code === '1') {
                this.tS.toastr({
                  type: 'success',
                  message: response.message,
                });
                this.getSupports();
              }
            });
        } else {
          this.getSupports();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  getDocView(id: number) {
    try {
      this.supportUseCase.getDocView(id).subscribe((response) => {
        Swal.fire({
          icon: 'info',
          html: `<div class="d-flex flex-column bd-highlight mb-3">
                  <div class="p-2 bd-highlight">
                    <strong>Tipo Doc:</strong> ${response.tipoDocumento}
                  </div>
                  <div class="p-2 bd-highlight">
                    <strong>Serie Comprobante:</strong> ${response.serieComprobante}
                  </div>
                </div>`,
        });
      });
    } catch (error) {
      console.log(error);
    }
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
