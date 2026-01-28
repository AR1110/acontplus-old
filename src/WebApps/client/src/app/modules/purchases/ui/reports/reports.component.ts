import { Subcategory } from '@accounting/data/models/subcategory';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { PURCHASE_CODE_REPORT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DOC_TYPE, PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { isValidField } from '@core/utils/utils';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';

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
  private tS = inject(ToastrNotificationService);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;
  private reportFacade = inject(ReportFacade);

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
      codEstab: isValidField(this.dataSearch.codEstab) ?? undefined,
      codDoc: isValidField(this.dataSearch.codDoc) ?? undefined,
      idProveedor:
        (this.dataSearch.supplierChecked && isValidField(this.dataSearch.idProveedor)) || null,
      codEstado: isValidField(this.dataSearch.codEstado),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      subcategoryId: this.dataSearch.subcategoryId,
    };

    const reportOptions = ReportParamsBuilder.build({
      codeReport: PURCHASE_CODE_REPORT.RCP,
      data: dataParms,
      format,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

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
