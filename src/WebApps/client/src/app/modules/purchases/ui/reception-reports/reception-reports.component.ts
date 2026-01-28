import { Subcategory } from '@accounting/data/models/subcategory';
import { PURCHASE_CODE_REPORT, ReportFacade, ReportParamsBuilder } from '@acontplus/ng-common';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DOC_TYPE_SRI, REPORT_FORMAT } from '@core/constants/global.constants';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { RECEIVED_DOCUMENT_HTTP_TOKEN } from '@purchases/data/purchases-token';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';

type EstabSelect = Omit<EstablecimientoSelectHtmlOnly, 'predeterminado'>;
type TipoDocSelect = Omit<TipoDoc, 'idTipoDocumento' | 'codigo'>;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reception-reports',
  imports: [
    FormsModule,
    SupplierSearchComponent,
    DateRangeSelectionComponent,
    UserSearchComponent,
    BreadcrumbComponent,
    Button,
    DynamicCard,
    MatCheckbox,
    MatDivider,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './reception-reports.component.html',
  styles: ``,
})
export class ReceptionReportsComponent implements OnInit {
  establecimientos = signal<EstabSelect[]>([]);
  documentTypes = signal<TipoDocSelect[]>([]);
  subcategories = signal<Subcategory[]>([]);
  isSearchSupplierSimple = true;
  dataSearch = {
    codEstab: '',
    codDoc: '',
    supplierChecked: false,
    userChecked: false,
    supplierName: '',
    userName: '',
    numeroIdentificacion: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    userId: 0,
    ckRetencion: null,
    subcategoryId: 0,
  };
  estadosRetencion = [
    {
      estado: null,
      descripcion: 'Todos',
    },
    {
      estado: false,
      descripcion: 'Sin Retención',
    },
    {
      estado: true,
      descripcion: 'Con Retención',
    },
  ];
  private docReceivedSvc = inject(RECEIVED_DOCUMENT_HTTP_TOKEN);
  private tS = inject(ToastrNotificationService);
  private reportFacade = inject(ReportFacade);

  ngOnInit() {
    this.docReceivedSvc.getDataFilter().subscribe((response) => {
      const { establecimientos, documentTypes, subcategories } = response;
      this.establecimientos.set(establecimientos);
      this.documentTypes.set(documentTypes);
      this.subcategories.set(subcategories);
      if (this.establecimientos().length > 0) {
        this.dataSearch.codEstab = this.establecimientos()[0].codEstab;
      }
      if (this.documentTypes().length > 0) {
        this.dataSearch.codDoc =
          this.documentTypes().find((tipoDoc) => tipoDoc.codigoSri === DOC_TYPE_SRI.F)?.codigoSri ||
          '';
      }
    });
  }

  onSupplierSelected(data: SupplierSearch) {
    this.dataSearch.supplierName = data.razonSocialComprador;
    this.dataSearch.numeroIdentificacion = data.identificacionComprador;
  }

  supplierclearSearch($event: any) {
    this.dataSearch.numeroIdentificacion = '';
  }

  onUserSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.userName = data.nombreComplero;
    this.dataSearch.userId = data.idUsuario;
  }

  userclearSearch($event: any) {
    this.dataSearch.userId = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  pdf() {
    this.getReport(REPORT_FORMAT.PDF);
  }

  excel() {
    this.getReport(REPORT_FORMAT.EXCEL);
  }

  getDataReport() {
    if (this.dataSearch.codDoc === DOC_TYPE_SRI.NC)
      return {
        tipo: 3,
        codigo: PURCHASE_CODE_REPORT.RRNC,
      };
    if (this.dataSearch.codDoc === DOC_TYPE_SRI.R)
      return {
        tipo: 4,
        codigo: PURCHASE_CODE_REPORT.RRG,
      };
    if (this.dataSearch.codDoc === DOC_TYPE_SRI.ND)
      return {
        tipo: 5,
        codigo: PURCHASE_CODE_REPORT.RRND,
      };
    return {
      tipo: 2,
      codigo: PURCHASE_CODE_REPORT.RRF,
    }; //Factura por defecto
  }

  onChangeDocType() {
    this.dataSearch.ckRetencion = null;
  }

  getReport(format: REPORT_FORMAT.PDF | REPORT_FORMAT.EXCEL) {
    if (this.dataSearch.supplierChecked && !isValidField(this.dataSearch.numeroIdentificacion)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el proveedor!',
      });
      return;
    }
    if (this.dataSearch.userChecked && !isValidField(this.dataSearch.userId)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el usuario!',
      });
      return;
    }
    const { tipo, codigo } = this.getDataReport();
    const dataParms = {
      tipo,
      format,
      ckFecha: true,
      codEstab: this.dataSearch.codEstab,
      codDoc: this.dataSearch.codDoc,
      identificacion:
        (this.dataSearch.supplierChecked && isValidField(this.dataSearch.numeroIdentificacion)) ||
        null,
      //  codEstado: isValidField(this.dataSearch.codEstado),
      idUsuario: isValidField(this.dataSearch.userId),
      ckRetencion: isValidField(this.dataSearch.ckRetencion),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      subcategoryId: this.dataSearch.subcategoryId,
    };

    const reportOptions = ReportParamsBuilder.build({
      codeReport: codigo,
      data: dataParms,
      format,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }
}
