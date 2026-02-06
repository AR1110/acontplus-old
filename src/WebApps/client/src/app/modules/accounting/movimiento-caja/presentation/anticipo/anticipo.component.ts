import { Component, inject, signal, OnInit } from '@angular/core';
import { AnticipoModalComponent } from '@accounting/movimiento-caja/presentation/anticipo/anticipo-modal/anticipo-modal.component';

import { AnticipoRead } from '@accounting/movimiento-caja/domain/anticipo.model';
import { SharedService } from '@core/services/shared.service';
import { REPORT_CODE } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { isValidField } from '@core/utils/utils';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import { AnticipoUseCase } from '@accounting/movimiento-caja/application/anticipo.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';

import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { finalize } from 'rxjs/operators';
import { UserRoleStateManager } from '@shared/store/user-role-state-manager';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-anticipo',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    CompanyCustomerSearchComponent,
    DateRangeSelectionComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './anticipo.component.html',
})
export class AnticipoComponent implements OnInit {
  establecimientos = signal<EstablecimientoSelectHtmlOnly[]>([]);
  dataSearch = {
    codEstab: '',
    customerId: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    checkBoxFecha: true,
  };
  private modalSvc = inject(DialogService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToastrNotificationService);
  private _anticipoUseCase = inject(AnticipoUseCase);
  $userRoleStateManager = inject(UserRoleStateManager);

  dataSource = signal<AnticipoRead[]>([]);

  isLoadingResults = signal(false);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Nro. Doc', type: 'string' },
    {
      key: 'subEntidadFinanciera',
      label: 'Entidad Financiera',
      type: 'string',
    },
    { key: 'valor', label: 'Valor', type: 'string' },
    { key: 'obs', label: 'Obs.', type: 'string' },
    { key: 'razonSocialCiente', label: 'Cliente', type: 'string' },
    { key: 'estadoDoc', label: 'Estado', type: 'string' },
    { key: 'nomUsuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map(colDef => colDef.key);

  pagination = signal(new MatPagination());

  getAnticipos() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: this.dataSearch.codEstab,
      idCliente: isValidField(this.dataSearch.customerId),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      checkBoxFecha: this.dataSearch.checkBoxFecha,
    };

    if (this.isLoadingResults()) return;
    this.dataSource.set([]);
    this.isLoadingResults.set(true);
    this._anticipoUseCase
      .getAll(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe(response => {
        this.dataSource.set(response);
        this.pagination.update(e => {
          return {
            ...e,
            totalRecords: this.dataSource().length > 0 ? this.dataSource()[0].totalRecords : 0,
          };
        });
      });
  }

  ngOnInit() {
    this._anticipoUseCase.getDataFilter().subscribe(response => {
      this.establecimientos.set(response.establecimientos);
      if (this.establecimientos().length > 0) {
        const dataEstab = this.establecimientos().find(item => item.predeterminado);

        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.getAnticipos();
        }
      }
    });
  }

  onCustomerSelected($event: CompanyCustomerEntity) {
    this.dataSearch.customerId = $event.idCliente;
  }

  resultCustomerEmptyInput($event: any) {
    this.dataSearch.customerId = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.getAnticipos();
  }

  refresh() {
    this.getAnticipos();
  }

  openModal<T>(data?: T) {
    const modalRef = this.modalSvc.open(AnticipoModalComponent, {
      size: 'lg',
      data: structuredClone(data) || {},
    });
    modalRef.subscribe(result => {
      if (result && typeof result === 'object') {
        this.getAnticipos();
      }
    });
  }

  getPrint(data: AnticipoRead) {
    // const parameters = {
    //   idDocument: data.idAnticipo,
    //   idTipoDocumento: data.idTipoDocumento,
    //   codEstab: data.codEstab,
    //   codDoc: data.codDoc,
    //   nroIdentificacion: data.identificacionUsuario,
    // };
    this.sharedSvc.askToPrint({
      id: data.idAnticipo,
      codDoc: data.codDoc,
      codEstab: data.codEstab,
    });
  }

  getReport(data: AnticipoRead) {
    const format = 'pdf';

    const dataParms = {
      tipo: 1,
      id: data.idAnticipo,
    };

    const parameters = {
      reportParams: JSON.stringify({
        codigo: REPORT_CODE.RA,
        format,
        codEstab: data.codEstab,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: 'pdf',
    });
  }

  askToDelete(data: AnticipoRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then(result => {
        if (!result.isConfirmed) return;
        this._anticipoUseCase.delete(data.idAnticipo).subscribe(response => {
          if (response.code === '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.tS.show({
              type: 'success',
              message: response.message,
            });
            this.getAnticipos();
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update(pag => {
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
