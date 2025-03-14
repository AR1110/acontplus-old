import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { MovimientoCajaRead } from '@accounting/core/domain/movimiento-caja.model';
import Swal from 'sweetalert2';
import { ModalEgresoIngresoComponent } from '@accounting/ui/movimiento-caja-page/egreso-ingreso-caja/modal-egreso-ingreso/modal-egreso-ingreso.component';
import { ACCOUNTING_CODE_REPORT } from '@accounting/core/enums/accounting.constants';
import { formatDateToString } from '@core/utils/date.util';
import { MovimientoCajaUseCase } from '@accounting/core/use-cases/movimiento-caja.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CompanyCustomerSearchMatComponent } from '@customer/ui/company-customer/components/company-customer-search-mat/company-customer-search-mat.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { UserRoleStateManager } from '@shared/store/user-role-state-manager';
import { DialogService } from '@core/services/dialog.service';
import {
  EgresoIngresoDialogComponent
} from "@accounting/ui/movimiento-caja-page/egreso-ingreso-caja/egreso-ingreso-dialog/egreso-ingreso-dialog.component";

@Component({
  selector: 'app-egreso-ingreso-caja',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DateRangeSelectionComponent,
    CompanyCustomerSearchMatComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './egreso-ingreso-caja.component.html',
})
export class EgresoIngresoCajaComponent implements OnInit {
  dataSearch = {
    codEstab: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    customerId: 0,
    codEstado: '',
  };
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  private dialogSvc = inject(DialogService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);
  private _movimientoCajaUseCase = inject(MovimientoCajaUseCase);
  $userRoleStateManager = inject(UserRoleStateManager);

  dataSource: MovimientoCajaRead[] = [];

  isLoadingResults = signal(false);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'caja', label: 'Caja', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Doc', type: 'string' },
    {
      key: 'subEntidadFinanciera',
      label: 'Entidad Financiera',
      type: 'string',
    },
    { key: 'valor', label: 'Valor', type: 'string' },
    { key: 'observaciones', label: 'Obs.', type: 'string' },
    { key: 'empleado', label: 'Empleado', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  getMovimientosCaja() {
    const params = {
      codEstab: this.dataSearch.codEstab,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      checkBoxFecha: true,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      customerId: isValidField(this.dataSearch.customerId),
      codEstado: isValidField(this.dataSearch.codEstado),
    };
    this.dataSource = [];

    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);
    this._movimientoCajaUseCase
      .getAll(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.dataSource = response || [];
        this.pagination.update((e) => {
          return {
            ...e,
            totalRecords:
              this.dataSource.length > 0 ? this.dataSource[0].totalRecords : 0,
          };
        });
      });
  }

  ngOnInit() {
    this._movimientoCajaUseCase.getDataFilter().subscribe((response) => {
      this.establecimientos = response.establecimientos;
      if (this.establecimientos.length > 0) {
        const dataEstab = this.establecimientos.find(
          (item) => item.predeterminado
        );
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.getMovimientosCaja();
        }
      }
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getMovimientosCaja();
  }

  refresh() {
    this.getMovimientosCaja();
  }

  onSelectCustomer($event: any) {
    this.dataSearch.customerId = $event.customerId;
    this.getMovimientosCaja();
  }

  onEmptyCustomer() {
    this.dataSearch.customerId = 0;
  }

  openModal(params?: any) {
    const modalRef = this.dialogSvc.open(EgresoIngresoDialogComponent, {
      size: 'lg',
      data: params || {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getMovimientosCaja();
      }
    });
  }

  getPrint(item: MovimientoCajaRead) {
    const parameters = {
      idDocument: item.idMovimientoCaja,
      idTipoDocumento: item.idTipoDocumento,
      codEstab: item.codEstab,
      codDoc: item.codDoc,
      nroIdentificacion: item.nroIdentificacion,
    };

    this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters),
    });
  }

  getReport(item: MovimientoCajaRead) {
    try {
      const format = 'pdf';
      const dataParms = {
        tipo: 1,
        id: item.idMovimientoCaja,
      };

      const parameters = {
        reportParams: JSON.stringify({
          codigo: ACCOUNTING_CODE_REPORT.RMIE,
          format,
          codEstab: item.codEstab,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataParms),
      };

      this.sharedSvc.getReport({
        data: parameters,
        format: 'pdf',
      });
    } catch (error) {
      console.log(error);
    }
  }

  askToDelete(item: MovimientoCajaRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar  ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this._movimientoCajaUseCase
            .delete(item.idMovimientoCaja)
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
                this.getMovimientosCaja();
              }
            });
        }
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
