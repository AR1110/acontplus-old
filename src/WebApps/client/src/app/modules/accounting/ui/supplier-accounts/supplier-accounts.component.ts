import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  REPORT_CODE,
  DOC_TYPE,
  PATHS_API,
} from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { isValidField } from '@core/utils/utils';
import { ACCOUNTING_PATHS } from '@accounting/core/enums/accounting.constants';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { formatDateToString } from '@core/utils/date.util';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-supplier-accounts',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    MatCardContent,
    MatCard,
    MatCardFooter,
    MatButton,
    ThemeButtonComponent,
  ],
  templateUrl: './supplier-accounts.component.html',
  styles: ``,
})
export class SupplierAccountsComponent {
  http = inject(HttpClient);
  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  tiposDoc: Array<Pick<TipoDoc, 'descripcion'> & { codDoc: string }> = [];
  estadosDoc: Array<{ codigo: string; descripcion: string }> = [];
  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: '',
    idProveedor: 0,
    codEstado: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    supplierChecked: false,
    supplierName: '',
    ckCxcVencida: false,
    ckCuotas: false,
    ckFecha: true,
  };
  isSearchSupplierSimple = true;
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  ngOnInit() {
    this.initialed();
  }

  onSupplierSelected(data: SupplierSearch) {
    this.dataSearch.supplierName = data.razonSocialComprador;
    this.dataSearch.idProveedor = data.idProveedor;
  }

  supplierResultEmptyInput($event: any) {
    this.dataSearch.idProveedor = 0;
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

  getReport(format: 'pdf' | 'excel') {
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
      if (!isValidField(this.dataSearch.idProveedor)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el proveedor',
        });
        return;
      }
    }

    const dataParms = {
      tipo: 2,
      format,
      ckFecha: this.dataSearch.ckFecha,
      codEstab: isValidField(this.dataSearch.codEstab),
      codDoc: isValidField(this.dataSearch.codDoc),
      idProveedor:
        (this.dataSearch.supplierChecked &&
          isValidField(this.dataSearch.idProveedor)) ||
        null,
      codEstado: isValidField(this.dataSearch.codEstado),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      ckCxcVencida: this.dataSearch.ckCxcVencida,
      ckCuotas: this.dataSearch.ckCuotas,
    };

    const parameters = {
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: this.dataSearch.ckCuotas ? REPORT_CODE.CCPC : REPORT_CODE.CCP,
        format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };

    this.sharedSvc.getReport({ data: parameters, format: format });
  }

  // getCodDoc() {
  //   if (this.dataSearch.codDoc === DOC_TYPE.LC) return DOC_TYPE_SRI.LC;
  //   if (this.dataSearch.codDoc === DOC_TYPE.IV) return DOC_TYPE.DNH;
  //   if (this.dataSearch.codDoc === DOC_TYPE.FE) return DOC_TYPE_SRI.F;
  //   return DOC_TYPE.FC;
  // }

  private initialed() {
    this.http
      .get(this.url, {
        params: {
          json: JSON.stringify({ tipo: 6 }),
        },
      })
      .subscribe((response) => {
        if (isApiResponse(response)) {
          if (response.code === '0') {
            console.log(response);
          }
          if (response.code === '1') {
            const [estabs, estadosDoc, tiposDoc] = JSON.parse(
              response.payload as string,
            );

            this.establecimientos = groupEstabUtil({
              estabs,
              isGroupPuntoEmision: true,
            });
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
                this.dataSearch.idPuntoEmision =
                  dataPuntoEmision.idPuntoEmision;
              }
            }
            this.tiposDoc = tiposDoc;
            this.dataSearch.codDoc =
              this.tiposDoc.find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FC)
                ?.codDoc || '';
            //console.log(this.tiposDoc)
            this.estadosDoc = estadosDoc;
          }
        }
      });
  }
}
