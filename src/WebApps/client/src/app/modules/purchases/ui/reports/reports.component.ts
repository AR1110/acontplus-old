import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REPORT_CODE, DOC_TYPE, PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { isValidField } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { Subcategory } from '@accounting/data/models/subcategory';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { formatDateToString } from '@core/utils/date.util';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reports',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    BreadcrumbComponent,
    SupplierSearchComponent,
    DateRangeSelectionComponent,
    Button,
    DynamicCard,
    MatDivider,
  ],
  templateUrl: './reports.component.html',
  styles: ``,
})
export class ReportsComponent implements OnInit {
  http = inject(HttpClient);
  establecimientos: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  tiposDoc: (Pick<TipoDoc, 'descripcion'> & { codDoc: string })[] = [];
  estadosDoc: { codigo: string; descripcion: string }[] = [];
  subcategories: Subcategory[] = [];
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
    subcategoryId: 0,
  };
  isSearchSupplierSimple = true;
  private sharedSvc = inject(SharedService);
  private tS = inject(ToastrNotificationService);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  ngOnInit() {
    this.initialed();
  }

  onSupplierSelected($event: any) {
    this.dataSearch.supplierName = $event.name;
    this.dataSearch.idProveedor = $event.idProveedor;
  }

  supplierclearSearch($event: any) {
    this.dataSearch.idProveedor = 0;
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      const dataEstab = this.establecimientos.find(
        (estab) => estab.codEstab === this.dataSearch.codEstab,
      );
      if (dataEstab) {
        this.puntosEmision = dataEstab.puntosEmision;

        this.dataSearch.idPuntoEmision =
          this.puntosEmision.find((ptoEmi) => ptoEmi.defaultPtoEmi)?.idPuntoEmision || 0;
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
      this.tS.show({
        type: 'warning',
        message: 'Ingrese fecha inicio',
      });
      return;
    }

    if (!isValidField(this.dataSearch.toDate)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese fecha fin',
      });
      return;
    }

    if (this.dataSearch.supplierChecked) {
      if (!isValidField(this.dataSearch.idProveedor)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el proveedor',
        });
        return;
      }
    }

    const dataParms = {
      tipo: 1,
      format,
      ckFecha: true,
      codEstab: isValidField(this.dataSearch.codEstab),
      codDoc: isValidField(this.dataSearch.codDoc),
      idProveedor:
        (this.dataSearch.supplierChecked && isValidField(this.dataSearch.idProveedor)) || null,
      codEstado: isValidField(this.dataSearch.codEstado),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      subcategoryId: this.dataSearch.subcategoryId,
    };

    const parameters = {
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: REPORT_CODE.RCP,
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
            const [estabs, estadosDoc, tiposDoc, subcategories] = JSON.parse(
              response.payload as string,
            );

            this.establecimientos = groupEstabUtil({
              estabs,
              isGroupPuntoEmision: true,
            });
            const dataEstab = this.establecimientos.find((estab) => estab.defaultEstab);
            if (dataEstab) {
              this.dataSearch.codEstab = dataEstab.codEstab;
              this.puntosEmision = dataEstab.puntosEmision;
              const dataPuntoEmision = this.puntosEmision.find((ptoEmi) => ptoEmi.defaultPtoEmi);
              if (dataPuntoEmision) {
                this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
              }
            }
            this.tiposDoc = tiposDoc;
            this.dataSearch.codDoc =
              this.tiposDoc.find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FC)?.codDoc || '';
            //console.log(this.tiposDoc)
            this.estadosDoc = estadosDoc;
            this.subcategories = subcategories;
          }
        }
      });
  }
}
