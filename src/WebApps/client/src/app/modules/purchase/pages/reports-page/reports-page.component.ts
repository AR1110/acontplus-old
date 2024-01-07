import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomDateRangeComponent } from '@core/components/custom-date-range/custom-date-range.component';
import { DOC_TYPE, PATHS_API } from '@core/constants/constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/constants/accounting_constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { ITipoDoc } from '@core/models/tipo-doc.model';
import { hideLoader, showLoader } from '@core/utils';
import { SharedService } from '@core/services/shared.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [FormsModule, BreadcrumbComponent, CustomDateRangeComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  router: Router = inject(Router);
  http = inject(HttpClient);
  sharedSvc = inject(SharedService)
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  tiposDoc: Array<ITipoDoc> = [];

  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: ''
  }

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


  getReport() {
    const format = 'pdf';
    const dataParms = {
      tipo: 1,
      format,
      codEstab: this.dataSearch.codEstab,
      codDoc: this.dataSearch.codDoc
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
    this.sharedSvc.getReport(parameters)


  }

}
