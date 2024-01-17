import { Component, inject } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { PurchaseModule } from '@modules/purchase/purchase.module';

import { HttpClient } from '@angular/common/http';
import { CODE_REPORT, DOC_TYPE, PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/constants/accounting.constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ITipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { Observable, OperatorFunction, catchError, debounceTime, map, retry, switchMap } from 'rxjs';
import { SupplierService } from '@modules/purchase/services/supplier.service';
import { SupplierSearch } from '@modules/purchase/models/supplier.model';
import { isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [AppModule, PurchaseModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  http = inject(HttpClient);
  private sharedSvc = inject(SharedService);
  private supplierSvc = inject(SupplierService)
  private tS = inject(ToasterService)
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  tiposDoc: Array<ITipoDoc> = [];
  estadosDoc: Array<{ codigo: string, descripcion: string }> = [];

  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: '',
    idProveedor: 0,
    checkboxSupplier: false,
    codEstado: '',
    fromDate: '',
    toDate: ''
  }

  supplierRazonSocial = ''


  searchSupplier: OperatorFunction<string, Array<SupplierSearch>> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return [];
        }

        return this.supplierSvc.search({ textSearch: term }).pipe(
          catchError((err) => {
            console.log(err);
            return [];
          })
        );
      })
    );

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

  onSelectSupplier($event: any) {
    let supplier: SupplierSearch = $event.item;
    this.dataSearch.idProveedor = supplier.idProveedor;

    setTimeout(() => {
      this.supplierRazonSocial = supplier.razonSocial
    })
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


  onChangeDateRange(data: { fromDate: any, toDate: any }) {
    this.dataSearch.fromDate = data.fromDate;
    this.dataSearch.toDate = data.toDate;
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

    if (this.dataSearch.checkboxSupplier) {
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
      codEstab: this.dataSearch.codEstab,
      codDoc: this.dataSearch.codDoc,
      idProveedor: this.dataSearch.checkboxSupplier && isValidField(this.dataSearch.idProveedor) || null,
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

    showLoader();
    this.sharedSvc.getReport(parameters, format)
  }

}
