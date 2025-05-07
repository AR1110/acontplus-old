import { Component, inject, signal } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AnticipoModalComponent } from '@accounting/ui/movimiento-caja-page/anticipo/anticipo-modal/anticipo-modal.component';

import { AnticipoRead } from '@accounting/core/models/anticipo.model';
import { SharedService } from '@core/services/shared.service';
import { REPORT_CODE } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { isValidField } from '@core/utils/utils';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import { AnticipoUseCase } from '@accounting/core/use-cases/anticipo.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';

import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { finalize } from 'rxjs/operators';
import { UserRoleStateManager } from '@shared/store/user-role-state-manager';
import {CompanyCustomer} from "@customer/domain/models/company-customer";

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
export class AnticipoComponent {
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  dataSearch = {
    codEstab: '',
    customerId: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    checkBoxFecha: true
  };
  private modalSvc = inject(ModalService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);
  private _anticipoUseCase = inject(AnticipoUseCase);
  $userRoleStateManager = inject(UserRoleStateManager);

  dataSource: AnticipoRead[] = [];

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
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  getAnticipos() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: this.dataSearch.codEstab,
      idCliente: isValidField(this.dataSearch.customerId),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      checkBoxFecha: this.dataSearch.checkBoxFecha
    };

    if (this.isLoadingResults()) return;
    this.dataSource = [];
    this.isLoadingResults.set(true);
    this._anticipoUseCase
      .getAll(params)
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.dataSource = response;
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
    this._anticipoUseCase.getDataFilter().subscribe((response) => {
      this.establecimientos = response.establecimientos;
      if (this.establecimientos.length > 0) {
        let dataEstab = this.establecimientos.find(
          (item) => item.predeterminado,
        );
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.getAnticipos();
        }
      }
    });
  }

  onCustomerSelected($event: CompanyCustomer) {
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
    const modalRef = this.modalSvc.openModalCustom(AnticipoModalComponent);
    modalRef.componentInstance.params = data;

    modalRef.result.then((result) => {
      if (typeof result === 'object') {
      }
    });
  }

  getPrint(data: AnticipoRead) {
    let parameters = {
      idDocument: data.idAnticipo,
      idTipoDocumento: data.idTipoDocumento,
      codEstab: data.codEstab,
      codDoc: data.codDoc,
      nroIdentificacion: data.identificacionUsuario,
    };
    this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters),
    });
  }

  getReport(data: AnticipoRead) {
    let format = 'pdf';

    let dataParms = {
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
      }).then((result) => {
        if (result.isConfirmed) {
          this._anticipoUseCase
            .delete(data.idAnticipo)
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
                this.getAnticipos();
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
