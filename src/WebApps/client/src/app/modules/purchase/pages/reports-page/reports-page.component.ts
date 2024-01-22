import { Component, inject } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { PurchaseModule } from '@modules/purchase/purchase.module';
import { HttpClient } from '@angular/common/http';
import { CODE_REPORT, DOC_TYPE, DOC_TYPE_SRI, PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/constants/accounting.constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SupplierSearchComponent } from '@modules/purchase/components/supplier-search/supplier-search.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [AppModule, PurchaseModule, SupplierSearchComponent, DateRangeSelectionComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  http = inject(HttpClient);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService)
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  tiposDoc: Array<TipoDoc> = [];
  estadosDoc: Array<{ codigo: string, descripcion: string }> = [];

  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: '',
    idProveedor: 0,
    codEstado: '',
    fromDate: '',
    toDate: '',
    supplierChecked: false,
    supplierName: ''
  }

  isSearchSupplierSimple = true;

  private initialed() {

    showLoader();
    this.http.get(this.url, {
      params: {
        json: JSON.stringify({ tipo: 6 })
      }
    }).subscribe({
      next: (response) => {
        hideLoader();
        if (isApiResponse(response)) {
          if (response.code === "0") {
            console.log(response)
          }
          if (response.code === "1") {
            const [estabs, estadosDoc, tiposDoc] = JSON.parse(response.payload as string);

            this.establecimientos = groupEstabUtil({
              estabs
            })
            const dataEstab = this.establecimientos.find(estab => estab.defaultEstab);
            if (dataEstab) {
              this.dataSearch.codEstab = dataEstab.codEstab;
              this.puntosEmision = dataEstab.puntosEmision;
              const dataPuntoEmision = this.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi);
              if (dataPuntoEmision) {
                this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
              }
            }
            this.tiposDoc = tiposDoc;

            console.log(this.tiposDoc)
            this.dataSearch.codDoc = this.tiposDoc.find(tipoDoc => tipoDoc.codigo === DOC_TYPE.FC)?.codigo || '';
            //console.log(this.tiposDoc)
            this.estadosDoc = estadosDoc;
          }
        }
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }


  ngOnInit() {
    this.initialed()
  }

  onSupplierSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.supplierName = data.razonSocial;
    this.dataSearch.idProveedor = data.idProveedor;
  }

  supplierResultEmptyInput($event: any) {
    this.dataSearch.idProveedor = 0
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      let dataEstab = this.establecimientos.find(estab => estab.codEstab === this.dataSearch.codEstab);
      if (dataEstab) {
        this.puntosEmision = dataEstab.puntosEmision;

        this.dataSearch.idPuntoEmision = this.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi)?.idPuntoEmision || 0;
        return
      }
    }
    this.dataSearch.idPuntoEmision = 0;
  }


  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  getCodDoc() {
    if (this.dataSearch.codDoc === DOC_TYPE.LC) return DOC_TYPE_SRI.LC;
    if (this.dataSearch.codDoc === DOC_TYPE.DNH) return DOC_TYPE.DNH;
    if (this.dataSearch.codDoc === DOC_TYPE.FV) return DOC_TYPE_SRI.F;
    return DOC_TYPE.FC;
  }



  getReport(format: 'pdf' | 'excel') {

    if (!isValidField(this.dataSearch.fromDate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese fecha inicio'
      })
      return
    }

    if (!isValidField(this.dataSearch.toDate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese fecha fin'
      })
      return
    }

    if (this.dataSearch.supplierChecked) {
      if (!isValidField(this.dataSearch.idProveedor)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el proveedor'
        })
        return
      }
    }






    const dataParms = {
      tipo: 1,
      format,
      ckFecha: true,
      codEstab: isValidField(this.dataSearch.codEstab),
      codDoc: this.getCodDoc(),
      idProveedor: this.dataSearch.supplierChecked && isValidField(this.dataSearch.idProveedor) || null,
      codEstado: isValidField(this.dataSearch.codEstado),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate
    }

    const parameters = {
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: CODE_REPORT.RCP,
        codEstab: this.dataSearch.codEstab,
        format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataParms)
    }

    this.sharedSvc.getReport(parameters, format)
  }

}
