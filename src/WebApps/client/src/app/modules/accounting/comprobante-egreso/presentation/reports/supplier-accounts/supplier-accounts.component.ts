import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, OnInit } from '@angular/core';
import { REPORT_CODE, DOC_TYPE } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { formatDateToString } from '@core/utils/date.util';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
import { Button, DynamicCard } from '@acontplus/ng-components';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CUENTA_POR_PAGAR_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { MatRadioModule } from '@angular/material/radio';

type EstadoSelect = Pick<TipoDoc, 'descripcion'> & { codDoc: string };

@Component({
  selector: 'app-supplier-accounts',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    Button,
    DynamicCard,
    MatCheckbox,
    MatDivider,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './supplier-accounts.component.html',
  styles: ``,
})
export class SupplierAccountsComponent implements OnInit {
  http = inject(HttpClient);
  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  tiposDoc = signal<EstadoSelect[]>([]);
  estadosDoc = signal<{ codigo: string; descripcion: string }[]>([]);

  dateFilterType = {
    emission: 1,
    expiration: 2,
  };

  searchFilters = {
    codEstab: '',
    idPuntoEmision: 0,
    documentCode: '',
    supplierId: 0,
    statusCode: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    supplierSelected: false,
    supplierName: '',
    ckCxcVencida: false,
    ckCuotas: false,
    useDateFilter: true,
    reportTypeCode: 'RG',
    useQuotaDueDateFilter: false,
    dateFilterType: this.dateFilterType.emission,
  };
  isSearchSupplierSimple = true;
  private sharedSvc = inject(SharedService);
  private tS = inject(ToastrNotificationService);
  private $getFilterDataUseCase = inject(CUENTA_POR_PAGAR_HTTP_TOKEN);

  reportTypeCode = {
    RG: 'RG', //Reporte General
    RD: 'RD', //Reporte Detallado
  };

  reportTypes = signal([
    { code: this.reportTypeCode.RG, name: 'Reporte General' },
    { code: this.reportTypeCode.RD, name: 'Reporte Detallado(Incluye cuotas)' },
  ]);

  private initialed() {
    this.$getFilterDataUseCase.getDataFilter().subscribe((response) => {
      this.establecimientos.set(response.estabs);
      const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);
      if (dataEstab) {
        this.searchFilters.codEstab = dataEstab.codEstab;
        this.puntosEmision.set(dataEstab.puntosEmision);
        const dataPuntoEmision = this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi);
        if (dataPuntoEmision) {
          this.searchFilters.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
        }
      }
      this.tiposDoc.set(response.tiposDoc);
      // this.searchFilters.documentCode =
      //   this.tiposDoc().find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FC)
      //     ?.codDoc || '';
      this.estadosDoc.set(response.estadosDoc);
    });
  }

  ngOnInit() {
    this.initialed();
  }

  onSupplierSelected(data: SupplierSearch) {
    this.searchFilters.supplierName = data.name;
    this.searchFilters.supplierId = data.idProveedor;
  }

  supplierclearSearch($event: any) {
    this.searchFilters.supplierId = 0;
  }

  onChangeEstab() {
    if (!isValidField(this.searchFilters.codEstab)) {
      this.searchFilters.idPuntoEmision = 0;
      return;
    }

    const dataEstab = this.establecimientos().find(
      (estab) => estab.codEstab === this.searchFilters.codEstab,
    );
    if (dataEstab) {
      this.puntosEmision.set(dataEstab.puntosEmision);

      this.searchFilters.idPuntoEmision =
        this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi)?.idPuntoEmision || 0;
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.searchFilters.fromDate = range.from;
    this.searchFilters.toDate = range.to;
  }

  private isValidSearchFilter() {
    if (!isValidField(this.searchFilters.fromDate)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese fecha inicio',
      });
      return;
    }

    if (!isValidField(this.searchFilters.toDate)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese fecha fin',
      });
      return;
    }

    if (this.searchFilters.supplierSelected && !getValidId(this.searchFilters.supplierId)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el proveedor',
      });
      return;
    }
    return true;
  }

  private getParamsReport(format: string) {
    const idProveedor =
      (this.searchFilters.supplierSelected && isValidField(this.searchFilters.supplierId)) || null;
    const ckCuotas = this.searchFilters.reportTypeCode === this.reportTypeCode.RD;
    const useQuotaDueDateFilter = this.searchFilters.useQuotaDueDateFilter;
    const dateFilterType = useQuotaDueDateFilter ? null : this.searchFilters.dateFilterType;
    return {
      tipo: 2,
      format,
      ckFecha: this.searchFilters.useDateFilter,
      codEstab: isValidField(this.searchFilters.codEstab),
      codDoc: isValidField(this.searchFilters.documentCode),
      idProveedor,
      codEstado: isValidField(this.searchFilters.statusCode),
      fechaInicio: this.searchFilters.fromDate,
      fechaFin: this.searchFilters.toDate,
      ckCxcVencida: this.searchFilters.ckCxcVencida,
      ckCuotas,
      useQuotaDueDateFilter,
      dateFilterType,
    };
  }

  getReport(format: 'pdf' | 'excel') {
    if (!this.isValidSearchFilter()) return;
    const dataParams = this.getParamsReport(format);

    const parameters = {
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: dataParams.ckCuotas ? REPORT_CODE.CCPC : REPORT_CODE.CCP,
        format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(this.getParamsReport(format)),
    };

    this.sharedSvc.getReport({ data: parameters, format: format });
  }
}
