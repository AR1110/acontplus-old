import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '@core/services/toaster.service';
import {
  CODE_REPORT,
  DOC_TYPE,
} from '@core/constants/global.constants';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { isValidField, removeSpacesInValue } from '@core/utils/utils';
import {
  SubEntidadFinancieraSelectHtmlOnly,
} from '@accounting/core/domain/subentidad-financiera.model';
import { SharedService } from '@core/services/shared.service';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {BancoSelectOnly} from "@accounting/core/domain/banco.interface";
import { formatDateToString } from '@core/utils/date.util';
import {ComprobanteIngresoUsecase} from "@accounting/core/usecases/comprobante-ingreso.usecase";

@Component({
    selector: 'app-reporte-cobros',
    templateUrl: './reporte-cobros.component.html',
    styles: ``,
    imports: [
        FormsModule,
        BreadcrumbComponent,
        DateRangeSelectionComponent,
        CompanyCustomerSearchComponent,
    ]
})
export class ReporteCobrosComponent implements OnInit {
  http = inject(HttpClient);
  // VARIABLES Y CONSTANTES
  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  tiposDoc: Array<Pick<TipoDoc, 'descripcion'> & { codDoc: string }> = [];
  subEntidadFinanciera: Array<SubEntidadFinancieraSelectHtmlOnly> = [];
  bancos: Array<BancoSelectOnly> = [];
  isCustomerSearchSimple = true;
  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: '',
    customerId: 0,
    idBanco: 0,
    idSubEntidadFinanciera: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    supplierChecked: false,
    documentoChecked: true,
    dateChecked: true,
    nroDocChecked: false,
    nroDocument: '',
    referenceChecked: false,
    reference: '',
    loteChecked: false,
    lote: '',
  };
  // Services
  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);

  private _comprobanteIngresoUseCase = inject(ComprobanteIngresoUsecase);


  ngOnInit(): void {
    this.getInitialLoad();
  }

  getInitialLoad() {

    this._comprobanteIngresoUseCase.getDataFilter().subscribe(response => {
      const { establecimientos, tiposDoc, subEntidadesFinanciera, bancos } = response;

      this.establecimientos = establecimientos;

      const dataEstab = this.establecimientos.find((estab) => estab.defaultEstab);

      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
        this.puntosEmision = dataEstab.puntosEmision;

        const dataPuntoEmision = this.puntosEmision.find(
          (ptoEmi) => ptoEmi.defaultPtoEmi,
        );
        if (dataPuntoEmision) {
          this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
        }
      }
      this.tiposDoc = tiposDoc;
      this.subEntidadFinanciera = subEntidadesFinanciera;
      this.bancos = bancos;
      this.dataSearch.codDoc = this.tiposDoc.find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FV)?.codDoc || '';
    })

  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      let dataEstab = this.establecimientos.find(
        (estab) => estab.codEstab === this.dataSearch.codEstab,
      );
      if (dataEstab) {
        this.puntosEmision = dataEstab.puntosEmision;

        this.dataSearch.idPuntoEmision =
          this.puntosEmision.find((ptoEmi) => ptoEmi.defaultPtoEmi)
            ?.idPuntoEmision || 0;
        return;
      }
    }
    this.dataSearch.idPuntoEmision = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  onCustomerSelected<T extends { data: any }>($event: T) {
    let { data } = $event;
    this.dataSearch.customerId = data.idCliente;
  }

  resultCustomerEmptyInput($event: any) {
    this.dataSearch.customerId = 0;
  }

  getReport(format: 'pdf' | 'excel') {
    try {
      if (!isValidField(this.dataSearch.fromDate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese fecha inicio',
        });
        return;
      }

      if (!isValidField(this.dataSearch.toDate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese fecha fin',
        });
        return;
      }

      if (this.dataSearch.supplierChecked) {
        if (!isValidField(this.dataSearch.customerId)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Seleccione el cliente',
          });
          return;
        }
      }

      const dataParms = {
        tipo: this.dataSearch.documentoChecked ? 1 : 2,
        format,
        codEstab: isValidField(this.dataSearch.codEstab),
        codDoc: isValidField(this.dataSearch.codDoc),
        idSubEntidadFinanciera: this.dataSearch.idSubEntidadFinanciera,
        idCustomer:
          (this.dataSearch.supplierChecked &&
            isValidField(this.dataSearch.customerId)) ||
          null,
        idPuntoEmision: this.dataSearch.idPuntoEmision,
        fechaInicio: this.dataSearch.fromDate,
        fechaFin: this.dataSearch.toDate,
        dateChecked: this.dataSearch.dateChecked,
        idBanco: this.dataSearch.idBanco,
        nroDocChecked: this.dataSearch.nroDocChecked,
        nroDocument: removeSpacesInValue(this.dataSearch.nroDocument),
        referenceChecked: this.dataSearch.referenceChecked,
        reference: removeSpacesInValue(this.dataSearch.reference),
        loteChecked: this.dataSearch.loteChecked,
        lote: removeSpacesInValue(this.dataSearch.lote),
      };

      const parameters = {
        reportParams: JSON.stringify({
          codEstab: this.dataSearch.codEstab,
          codigo: this.dataSearch.documentoChecked
            ? CODE_REPORT.RCXD
            : CODE_REPORT.RCXC,
          format,
        }),
        dataParams: JSON.stringify(dataParms),
      };
      this.sharedSvc.getReport({ data: parameters, format: format });
    } catch (error: any) {
      if (error.status === 400) {
        this.tS.toastr({
          type: 'warning',
          message: 'No se pudo obtener el reporte',
        });
      } else {
        console.log(error);
      }
    }
  }
}
