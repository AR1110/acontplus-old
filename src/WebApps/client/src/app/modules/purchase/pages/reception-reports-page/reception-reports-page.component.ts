import { Component, inject } from '@angular/core';
import { DocumentReceivedService } from '@modules/purchase/services/document-received.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import {
  CODE_REPORT,
  DOC_TYPE_SRI,
  FORMAT_REPORT,
} from '@core/constants/global.constants';
import { UserSearchComponent } from '@core/components/user-search/user-search.component';
import { isValidField } from '@core/utils/utils';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Subcategory } from '@accounting/core/domain/subcategory';
import { SupplierSearchComponent } from '@modules/customer/supplier/components/supplier-search/supplier-search.component';
import { formatDateToString } from '@core/utils/date.util';

@Component({
    selector: 'app-reception-reports-page',
    imports: [
        FormsModule,
        SupplierSearchComponent,
        DateRangeSelectionComponent,
        UserSearchComponent,
        BreadcrumbComponent,
    ],
    templateUrl: './reception-reports-page.component.html',
    styles: ``
})
export class ReceptionReportsPageComponent {
  establecimientos: Array<
    Omit<EstablecimientoSelectHtmlOnly, 'predeterminado'>
  > = [];
  documentTypes: Array<Omit<TipoDoc, 'idTipoDocumento' | 'codigo'>> = [];
  subcategories: Subcategory[] = [];
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
  private docReceivedSvc = inject(DocumentReceivedService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);

  ngOnInit() {
    this.docReceivedSvc.getDataFilter().subscribe((response) => {
      const { establecimientos, documentTypes, subcategories } = response;
      this.establecimientos = establecimientos;
      this.documentTypes = documentTypes;
      this.subcategories = subcategories;
      if (this.establecimientos.length > 0) {
        this.dataSearch.codEstab = this.establecimientos[0].codEstab;
      }
      if (this.documentTypes.length > 0) {
        this.dataSearch.codDoc =
          this.documentTypes.find(
            (tipoDoc) => tipoDoc.codigoSri === DOC_TYPE_SRI.F,
          )?.codigoSri || '';
      }
    });
  }

  onSupplierSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.supplierName = data.razonSocial;
    this.dataSearch.numeroIdentificacion = data.numeroIdentificacion;
  }

  supplierResultEmptyInput($event: any) {
    this.dataSearch.numeroIdentificacion = '';
  }

  onUserSelected<T extends { data: any }>($event: T) {
    const { data } = $event;
    this.dataSearch.userName = data.nombreComplero;
    this.dataSearch.userId = data.idUsuario;
  }

  userResultEmptyInput($event: any) {
    this.dataSearch.userId = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  pdf() {
    this.getReport(FORMAT_REPORT.PDF);
  }

  excel() {
    this.getReport(FORMAT_REPORT.EXCEL);
  }

  getDataReport() {
    if (this.dataSearch.codDoc === DOC_TYPE_SRI.NC)
      return {
        tipo: 3,
        codigo: CODE_REPORT.RRNC,
      };
    if (this.dataSearch.codDoc === DOC_TYPE_SRI.R)
      return {
        tipo: 4,
        codigo: CODE_REPORT.RRG,
      };
    return {
      tipo: 2,
      codigo: CODE_REPORT.RRF,
    }; //Factura por defecto
  }

  onChangeDocType() {
    this.dataSearch.ckRetencion = null;
  }

  getReport(format: FORMAT_REPORT.PDF | FORMAT_REPORT.EXCEL) {
    if (
      this.dataSearch.supplierChecked &&
      !isValidField(this.dataSearch.numeroIdentificacion)
    ) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el proveedor!',
      });
      return;
    }
    if (this.dataSearch.userChecked && !isValidField(this.dataSearch.userId)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el usuario!',
      });
      return;
    }
    let { tipo, codigo } = this.getDataReport();
    const dataParms = {
      tipo,
      format,
      ckFecha: true,
      codEstab: this.dataSearch.codEstab,
      codDoc: this.dataSearch.codDoc,
      identificacion:
        (this.dataSearch.supplierChecked &&
          isValidField(this.dataSearch.numeroIdentificacion)) ||
        null,
      //  codEstado: isValidField(this.dataSearch.codEstado),
      idUsuario: isValidField(this.dataSearch.userId),
      ckRetencion: isValidField(this.dataSearch.ckRetencion),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      subcategoryId: this.dataSearch.subcategoryId,
    };

    const parameters = {
      reportParams: JSON.stringify({
        hasParams: false,
        codigo,
        format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };

    this.sharedSvc.getReport({ data: parameters, format: format });
  }
}
