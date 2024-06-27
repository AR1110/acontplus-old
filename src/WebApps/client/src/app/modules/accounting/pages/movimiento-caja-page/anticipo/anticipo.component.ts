import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AnticipoModalComponent } from './anticipo-modal/anticipo-modal.component';
import { AnticipoService } from '@modules/accounting/services/anticipo.service';
import { AnticipoRead } from '@modules/accounting/models/anticipo.model';
import { SharedService } from '@core/services/shared.service';
import { CODE_REPORT } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { isValidField } from '@core/utils/utils';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyCustomerSearchComponent } from '@company-customer/components/company-customer-search/company-customer-search.component';
import {NgbDropdownModule, NgbPagination} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-anticipo',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    CompanyCustomerSearchComponent,
    NgbPagination,
    DateRangeSelectionComponent,
  ],
  templateUrl: './anticipo.component.html',
})
export class AnticipoComponent {
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  isCustomerSearchSimple = true;
  anticipos: Array<AnticipoRead> = [];
  recordsQuantity = [25, 50, 100];
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    codEstab: '',
    customerId: 0,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
  };
  totalRecords = 0;
  private modalSvc = inject(ModalService);
  private anticipoSvc = inject(AnticipoService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);

  getAnticipos() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize,
      codEstab: this.dataSearch.codEstab,
      idCliente: isValidField(this.dataSearch.customerId),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
    };

    this.anticipos = [];
    this.anticipoSvc.getAll(params).subscribe((response) => {
      this.anticipos = response;
      this.totalRecords =
        this.anticipos.length > 0 ? this.anticipos[0].totalRecords : 0;
    });
  }

  ngOnInit() {
    this.anticipoSvc.getDataFilter().subscribe((response) => {
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

  onCustomerSelected<T extends { data: any }>($event: T) {
    let { data } = $event;
    this.dataSearch.customerId = data.idCliente;
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
        codigo: CODE_REPORT.RA,
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
          this.anticipoSvc.delete(data.idAnticipo).subscribe((response) => {
            if (isApiResponse(response)) {
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
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  pageChanged(): void {
    this.getAnticipos();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getAnticipos();
  }
}
