import { MatSelectModule } from '@angular/material/select';

import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { getValidId, isValidField } from '@core/utils/utils';

import {
  MECHANICAL_CODE_REPORT,
  MECHANICAL_STATUS,
} from '@mechanical/domain/enums/mechanical.enum';
import { Pagination, DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import Swal from 'sweetalert2';

import { InspectionModalComponent } from '../inspection-page/components/inspection-modal/inspection-modal.component';
import { SupportAddEditModalComponent } from './components/support-add-edit-modal/support-add-edit-modal.component';
import { SupportMaintenanceModalComponent } from './components/support-maintenance-modal/support-maintenance-modal.component';
import { formatDateToString } from '@core/utils/date.util';
import { PageEvent } from '@angular/material/paginator';
import { SupportUseCase } from '@mechanical/application/use-cases/support.use-case';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { DialogService } from '@core/services/dialog.service';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { ConvertDocDialogComponent } from '@mechanical/ui/pages/support-page/components/convert-doc-dialog/convert-doc-dialog.component';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MechanicalStore } from '@mechanical/application/store/mechanical.store';

@Component({
  selector: 'app-support-page',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DateRangeSelectionComponent,
    DataGrid,
    Button,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './support-page.component.html',
})
export class SupportPageComponent implements OnInit, AfterViewInit {
  $store = inject(MechanicalStore);
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  dialogSvc = inject(DialogService);
  supportUseCase = inject(SupportUseCase);
  private tS = inject(NotificationService);
  sharedSvc = inject(SharedService);

  visibleColumns: string[] = [];

  dataSource = signal<any[]>([]);
  dataSearch = {
    ckDate: true,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    customerId: null as number | null,
    licensePlate: null as string | null,
    assigned: false,
    supportStatusId: 0,
  };

  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Estado', field: 'status', sortable: true },
    { header: 'Nro. Doc', field: 'sequence', sortable: true },
    { header: 'Fecha Emisión', field: 'fechaEmision', sortable: true },
    { header: 'Identificación', field: 'idCard', sortable: true },
    { header: 'Cliente/Conductor', field: 'tradeName', sortable: true },
    { header: 'Placa', field: 'licensePlate', sortable: true },
    { header: 'Encargado', field: 'userAssigned', sortable: true },
    { header: 'Obs.', field: 'obs', sortable: false },
    { header: 'Entregar', field: 'entregar', sortable: false },
  ];

  pagination = signal(new Pagination());

  isLoadingResults = signal(false);

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

  onCustomerSelected(data: CompanyCustomerEntity) {
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

      const params = {
        ckDate: this.dataSearch.ckDate,
        pageIndex: this.pagination().pageIndex + 1,
        pageSize: this.pagination().pageSize,
        supportStatusId: getValidId(this.dataSearch.supportStatusId),
        fromDate: this.dataSearch.fromDate,
        toDate: this.dataSearch.toDate,
        customerId: this.dataSearch.customerId,
        licensePlate: isValidField(this.dataSearch.licensePlate),
      };
      this.dataSource.set([]);
      this.isLoadingResults.set(true);
      this.supportUseCase
        .getAll(params)
        .pipe(finalize(() => this.isLoadingResults.set(false)))
        .subscribe((response) => {
          this.dataSource.set(response);
          if (this.dataSource().length > 0) {
            this.pagination().totalRecords = this.dataSource()[0].totalRecords;
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    const dataStatus = this.$store
      .supportStatus()
      .find((st) => st.code === this.$store.valueStatus());
    this.dataSearch.supportStatusId = dataStatus?.id || 0;

    if (this.$store.isDashboard()) {
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
    // Templates se asignan automáticamente en acp-data-grid
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
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
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
    const modalRef = this.dialogSvc.open(SupportMaintenanceModalComponent, {
      size: 'xl',
      data: {
        id,
      },
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getSupports();
      }
    });
  }

  openModalInspection(id: number) {
    const modalRef = this.dialogSvc.open(InspectionModalComponent, {
      size: 'xl',
      data: {
        supportId: id,
      },
    });

    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getSupports();
      }
    });
  }

  askToConvertToDoc(id: number) {
    this.supportUseCase.getConvertToAprobDoc(id).subscribe((response) => {
      const dialogRef = this.dialogSvc.open(ConvertDocDialogComponent, {
        size: 'lg',
        data: response,
      });

      dialogRef.subscribe((result) => {
        if (result && typeof result === 'object') {
          this.getSupports();
        }
      });
    });
  }

  // For report
  getReport(item: any) {
    const format = 'pdf';
    const dataParams = { supportId: item.id, tipo: 1 };
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
    const supportStatusId = this.$store
      .supportStatus()
      .find((st) => st.code === MECHANICAL_STATUS.POR_ENTREGAR)?.id;
    if (!(supportStatusId > 0)) {
      this.tS.warning({ message: `No se encontró el estado ${supportStatusId}` });
      return;
    }
    try {
      Swal.fire({
        text: '¿Estás seguro de Entregar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.supportUseCase.putState(id, supportStatusId).subscribe((response) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
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
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
