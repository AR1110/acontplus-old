import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { HttpClient } from '@angular/common/http';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/core/models/subentidad-financiera.model';
import { BancoSelectOnly } from '@accounting/core/models/banco.interface';
import { formatDateToString } from '@core/utils/date.util';
import { ToasterService } from '@core/services/toaster.service';
import { SharedService } from '@core/services/shared.service';
import { ComprobanteEgresoUseCase } from '@accounting/core/use-cases/comprobante-egreso.use-case';
import { DOC_TYPE } from '@core/constants/global.constants';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-reporte-pagos',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './reporte-pagos.component.html',
  styles: ``,
})
export class ReportePagosComponent implements OnInit {
  http = inject(HttpClient);

  // CONSTANTS
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

  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);

  private _comprobanteEgresoUseCase = inject(ComprobanteEgresoUseCase);

  ngOnInit(): void {
    this.getInitialLoad();
  }

  getInitialLoad() {
    this._comprobanteEgresoUseCase.getDataFilter().subscribe((response) => {
      const { establecimientos, tiposDoc, subEntidadesFinanciera, bancos } =
        response;

      this.establecimientos = establecimientos;

      const dataEstab = this.establecimientos.find(
        (estab) => estab.defaultEstab,
      );

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
      this.dataSearch.codDoc =
        this.tiposDoc.find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FV)
          ?.codDoc || '';
    });
  }
}
