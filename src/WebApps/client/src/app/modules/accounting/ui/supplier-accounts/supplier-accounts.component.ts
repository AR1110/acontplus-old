import { HttpClient } from '@angular/common/http';
import {Component, inject, signal} from '@angular/core';
import {
  REPORT_CODE,
  DOC_TYPE,
} from '@core/constants/global.constants';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { formatDateToString } from '@core/utils/date.util';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {
  GetFilterDataCuentaPorPagarUseCase
} from "@accounting/core/use-cases/cuenta-por-pagar/get-filter-data-cuenta-por-pagar.use-case";


type EstadoSelect = Pick<TipoDoc, 'descripcion'> & { codDoc: string }

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
    MatDynamicCardComponent,
    MatCheckbox,
    MatDivider,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './supplier-accounts.component.html',
  styles: ``,
})
export class SupplierAccountsComponent {
  http = inject(HttpClient);
  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  tiposDoc = signal<EstadoSelect[]>([])
  estadosDoc = signal<{ codigo: string; descripcion: string }[]>([]);
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
  private $getFilterDataUseCase = inject(GetFilterDataCuentaPorPagarUseCase)

  ngOnInit() {
    this.initialed();
  }

  onSupplierSelected(data: SupplierSearch) {
    this.dataSearch.supplierName = data.name;
    this.dataSearch.idProveedor = data.idProveedor;
  }

  supplierclearSearch($event: any) {
    this.dataSearch.idProveedor = 0;
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      let dataEstab = this.establecimientos().find(
        (estab) => estab.codEstab === this.dataSearch.codEstab,
      );
      if (dataEstab) {
        this.puntosEmision.set(dataEstab.puntosEmision);

        this.dataSearch.idPuntoEmision =
          this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi)
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
    this.$getFilterDataUseCase.execute().subscribe(response=>{
      this.establecimientos.set(response.estabs);
      const dataEstab = this.establecimientos().find(
        (estab) => estab.defaultEstab,
      );
      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
        this.puntosEmision.set(dataEstab.puntosEmision);
        const dataPuntoEmision = this.puntosEmision().find(
          (ptoEmi) => ptoEmi.defaultPtoEmi,
        );
        if (dataPuntoEmision) {
          this.dataSearch.idPuntoEmision =
            dataPuntoEmision.idPuntoEmision;
        }
      }
      this.tiposDoc.set(response.tiposDoc);
      this.dataSearch.codDoc =
        this.tiposDoc().find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FC)
          ?.codDoc || '';
      this.estadosDoc.set(response.estadosDoc);
    })

  }
}
