import { Component, inject, signal, OnInit } from '@angular/core';
import { AnticipoModalComponent } from '@accounting/ui/movimiento-caja-page/anticipo/anticipo-modal/anticipo-modal.component';

import { AnticipoRead } from '@accounting/data/models/anticipo.model';
import { SharedService } from '@core/services/shared.service';
import { REPORT_CODE } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { isValidField } from '@core/utils/utils';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import { AnticipoUseCase } from '@accounting/data/anticipo.use-case';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';

import { DataGrid, DataGridColumn, Pagination, Button } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
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
    DataGrid,
    Button,
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

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: 'Nro.' },
    { field: 'op', header: 'Op.' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'serieComprobante', header: 'Nro. Doc' },
    { field: 'subEntidadFinanciera', header: 'Entidad Financiera' },
    { field: 'valor', header: 'Valor' },
    { field: 'obs', header: 'Obs.' },
    { field: 'razonSocialCiente', header: 'Cliente' },
    { field: 'estadoDoc', header: 'Estado' },
    { field: 'nomUsuario', header: 'Usuario' },
  ];

  pagination = signal(new Pagination());

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
      .subscribe((response) => {
        this.dataSource.set(response as AnticipoRead[]);
        this.pagination.update(
          (e) =>
            new Pagination(
              e.pageIndex,
              e.pageSize,
              this.dataSource().length > 0 ? this.dataSource()[0].totalRecords : 0,
            ),
        );
      });
  }

  ngOnInit() {
    this._anticipoUseCase.getDataFilter().subscribe((response) => {
      this.establecimientos.set(response.establecimientos as EstablecimientoSelectHtmlOnly[]);
      if (this.establecimientos().length > 0) {
        const dataEstab = this.establecimientos().find((item) => item.predeterminado);

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

  resultCustomerEmptyInput(_event: unknown) {
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
      data: structuredClone(data) ?? {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getAnticipos();
      }
    });
  }

  getPrint(data: AnticipoRead) {
    const parameters = {
      idDocument: data.idAnticipo,
      idTipoDocumento: data.idTipoDocumento,
      codEstab: data.codEstab,
      codDoc: data.codDoc,
      nroIdentificacion: data.identificacionUsuario,
    };
    void this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters),
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
      void Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (!result.isConfirmed) return;
        this._anticipoUseCase.delete(data.idAnticipo).subscribe((response) => {
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
