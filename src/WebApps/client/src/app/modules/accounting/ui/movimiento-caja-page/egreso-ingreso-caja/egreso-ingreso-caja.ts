import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { NotificationService } from '@acontplus/ng-notifications';
import { isValidField } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { ACCOUNTING_CODE_REPORT } from '@accounting/shared/enums/accounting.constants';
import { formatDateToString } from '@core/utils/date.util';
import { MovimientoCajaUseCase } from '@accounting/movimiento-caja/application/movimiento-caja.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataGrid, DataGridColumn, Pagination, Button } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { UserRoleStateManager } from '@shared/store/user-role-state-manager';
import { DialogService } from '@core/services/dialog.service';
import { EgresoIngresoDialogComponent } from '@accounting/ui/movimiento-caja-page/egreso-ingreso-caja/egreso-ingreso-dialog/egreso-ingreso-dialog.component';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { ListMovimientoCajaUseCase } from '@accounting/movimiento-caja/application/list-movimiento-caja.use-case';
import { MovimientoCajaList } from '@accounting/movimiento-caja/domain/movimiento-caja.model';

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
    CompanyCustomerSearchComponent,
    DataGrid,
    Button,
  ],
  templateUrl: './egreso-ingreso-caja.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgresoIngresoCaja implements OnInit {
  dataSearch = signal({
    codEstab: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    customerId: 0,
    codEstado: '',
    enableDateFilter: true,
  });
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  private dialogSvc = inject(DialogService);
  private sharedSvc = inject(SharedService);
  private notificationSvc = inject(NotificationService);
  private _movimientoCajaUseCase = inject(MovimientoCajaUseCase);
  private $listUseCase = inject(ListMovimientoCajaUseCase);
  $userRoleStateManager = inject(UserRoleStateManager);

  dataSource: MovimientoCajaList[] = [];

  isLoadingResults = signal(false);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: 'Nro.' },
    { field: 'op', header: 'Op.' },
    { field: 'nomCaja', header: 'Caja' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'nroDoc', header: 'Nro. Doc' },
    { field: 'nomSubEntidadFinanciera', header: 'Entidad Financiera' },
    { field: 'valor', header: 'Valor' },
    { field: 'observaciones', header: 'Obs.' },
    { field: 'nomEmpleado', header: 'Cliente' },
    { field: 'nomUsuario', header: 'Usuario' },
    { field: 'nomEstado', header: 'Estado' },
  ];

  pagination = signal(new Pagination());

  getMovimientosCaja() {
    const params = {
      checkBoxFecha: this.dataSearch().enableDateFilter,
      codEstab: this.dataSearch().codEstab,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      fechaInicio: this.dataSearch().fromDate,
      fechaFin: this.dataSearch().toDate,
      customerId: isValidField(this.dataSearch().customerId),
      codEstado: isValidField(this.dataSearch().codEstado),
    };
    this.dataSource = [];

    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);
    this.$listUseCase
      .execute(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.dataSource = response.data;
        this.pagination.update(
          (e) => new Pagination(e.pageIndex, e.pageSize, response.totalRecords),
        );
      });
  }

  ngOnInit() {
    this._movimientoCajaUseCase
      .getDataFilter()
      .subscribe((response: { establecimientos: EstablecimientoSelectHtmlOnly[] }) => {
        this.establecimientos = response.establecimientos;
        if (this.establecimientos.length > 0) {
          const dataEstab = this.establecimientos.find((item) => item.predeterminado);
          if (dataEstab) {
            this.dataSearch.update((prev) => ({ ...prev, codEstab: dataEstab.codEstab }));
            this.getMovimientosCaja();
          }
        }
      });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.update((prev) => ({
      ...prev,
      fromDate: range.from,
      toDate: range.to,
    }));
    this.getMovimientosCaja();
  }

  refresh() {
    this.getMovimientosCaja();
  }

  onSelectCustomer($event: CompanyCustomerEntity) {
    this.dataSearch.update((prev) => ({ ...prev, customerId: $event.customerId }));
    this.getMovimientosCaja();
  }

  onEmptyCustomer() {
    this.dataSearch.update((prev) => ({ ...prev, customerId: 0 }));
  }

  openModal(params?: unknown) {
    const modalRef = this.dialogSvc.open(EgresoIngresoDialogComponent, {
      size: 'lg',
      data: params ?? {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getMovimientosCaja();
      }
    });
  }

  getPrint(item: MovimientoCajaList) {
    const parameters = {
      idDocument: item.idMovimientoCaja,
      idTipoDocumento: item.idTipoDocumento,
      codEstab: item.codEstab,
      codDoc: item.codDoc,
      nroIdentificacion: item.nroIdentificacion,
    };

    void this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters),
    });
  }

  getReport(item: MovimientoCajaList) {
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
      console.error(error);
    }
  }

  askToDelete(item: MovimientoCajaList) {
    try {
      void Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar  ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this._movimientoCajaUseCase.delete(item.idMovimientoCaja).subscribe((response) => {
            if (response.code === '0') {
              this.notificationSvc.show({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.notificationSvc.show({
                type: 'success',
                message: response.message,
              });
              this.getMovimientosCaja();
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
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
