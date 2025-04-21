import { Component, inject } from '@angular/core';
import { DocumentReceivedWebRepository } from '@purchase/data/document-received/document-received-web.repository';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import {
  CODE_REPORT,
  DOC_TYPE_SRI,
  REPORT_FORMAT,
} from '@core/constants/global.constants';
import { UserSearchComponent } from '@core/components/user-search/user-search.component';
import { isValidField } from '@core/utils/utils';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Subcategory } from '@accounting/core/models/subcategory';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { formatDateToString } from '@core/utils/date.util';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-reception-reports',
    imports: [
        FormsModule,
        SupplierSearchComponent,
        DateRangeSelectionComponent,
        UserSearchComponent,
        BreadcrumbComponent,
        MatCardContent,
        MatCard,
        MatCardFooter,
        ThemeButtonComponent,
    ],
  templateUrl: './reception-reports.component.html',
  styles: ``,
})
export class ReceptionReportsComponent {
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
  private docReceivedSvc = inject(DocumentReceivedWebRepository);
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

  onSupplierSelected(data: SupplierSearch) {
    this.dataSearch.supplierName = data.razonSocialComprador;
    this.dataSearch.numeroIdentificacion = data.identificacionComprador;
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
    this.getReport(REPORT_FORMAT.PDF);
  }

  excel() {
    this.getReport(REPORT_FORMAT.EXCEL);
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

  getReport(format: REPORT_FORMAT.PDF | REPORT_FORMAT.EXCEL) {
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
