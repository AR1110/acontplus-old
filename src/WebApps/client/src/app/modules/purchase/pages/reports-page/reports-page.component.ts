import { Component, inject } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { PurchaseModule } from '@modules/purchase/purchase.module';

import { HttpClient } from '@angular/common/http';
import { DOC_TYPE, PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/constants/accounting_constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ITipoDoc } from '@core/models/tipo-doc.model';
import { hideLoader, showLoader } from '@core/utils';
import { SharedService } from '@core/services/shared.service';
import { Observable, OperatorFunction, catchError, debounceTime, map, switchMap } from 'rxjs';
import { SupplierService } from '@modules/purchase/services/supplier.service';
import { SupplierSearch } from '@modules/purchase/models/supplier.model';
import { isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [AppModule, PurchaseModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  http = inject(HttpClient);
  sharedSvc = inject(SharedService);
  supplierSvc = inject(SupplierService)
  private tS = inject(ToasterService)
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  tiposDoc: Array<ITipoDoc> = [];

  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: '',
    idProveedor: 0,
    checkboxSupplier: false
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
            console.log(this.tiposDoc)


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




  getReport() {

    if (this.dataSearch.checkboxSupplier) {
      if (!isValidField(this.dataSearch.idProveedor)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el proveedor'
        })
        return
      }
    }
    const format = 'pdf';
    const dataParms = {
      tipo: 1,
      format,
      codEstab: this.dataSearch.codEstab,
      codDoc: this.dataSearch.codDoc,
      idProveedor: this.dataSearch.checkboxSupplier && isValidField(this.dataSearch.idProveedor) || null
    }

    const parameters = {
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: 'RCP',
        codEstab: this.dataSearch.codEstab,
        format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataParms)
    }

    showLoader();
    this.sharedSvc.getReport(parameters)


  }

}
