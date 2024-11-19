import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { CuentaPorCobrarService } from '@accounting/services/cuenta-por-cobrar.service';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import {
  CODE_ESTADO,
  DOC_TYPE,
  DOC_TYPE_SRI,
  FORMAT_REPORT,
} from '@core/constants/global.constants';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@company-customer/components/company-customer-search/company-customer-search.component';
import { UserSearchComponent } from '@core/components/user-search/user-search.component';
import { ToasterService } from '@core/services/toaster.service';
import { SharedService } from '@core/services/shared.service';
import { isValidField } from '@core/utils/utils';
import { SALE_CODE_REPORT } from '@sale/enums/sale.enum';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf } from '@angular/common';
import { formatDateToString } from '@core/utils/date.util';

@Component({
  selector: 'app-sale-report-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    UserSearchComponent,
    FaIconComponent,
    NgForOf,
  ],
  templateUrl: './sale-report-page.component.html',
  styles: ``,
})
export class SaleReportPageComponent {
  isSelectedNotaEntrega = false;
  dataSearch = {
    checkBoxCustomer: false,
    checkBoxUser: false,
    ckFecha: false,
    checkboxCompanyCustomer: false,
    idEstablecimiento: 0,
    idPuntoEmision: 0,
    codEstado: null as string | null,
    codDoc: null as string | null,
    convertToDoc: false,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    companyCustomerId: 0,
    idEstadoDocumento: 0,
    userId: 0,
    identificacion: null,
    idCiudad: 0,
  };
  establecimientos: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc: any[] = [];
  tiposDoc: any[] = [];
  empresas: any[] = [];
  format: any;
  provinciasAgrupadas: any[] = [];
  private cuentaPorCobrarSvc = inject(CuentaPorCobrarService);
  private tS = inject(ToasterService);
  private sharedSvc = inject(SharedService);

  getDataFilter() {
    this.cuentaPorCobrarSvc.getDataFilter().subscribe((response) => {
      const { estabs, estadosDoc, tiposDoc, empresas, ciudades } = response;

      this.establecimientos = estabs;
      this.estadosDoc = estadosDoc;
      this.tiposDoc = [
        ...tiposDoc,
        {
          idTipoDocumento: 0,
          descripcion: 'Consolidado Diario de Venta',
          codigoSri: '',
          codigo: DOC_TYPE.CDV,
        },
      ];
      this.empresas = empresas;
      this.provinciasAgrupadas = ciudades.reduce(
        (agrupador: any, ciudad: any) => {
          const provinciaIndex = agrupador.findIndex(
            (p: any) => p.nombre === ciudad.provincia,
          );
          if (provinciaIndex >= 0) {
            agrupador[provinciaIndex].ciudades.push(ciudad);
          } else {
            agrupador.push({
              nombre: ciudad.provincia,
              ciudades: [ciudad],
            });
          }
          return agrupador;
        },
        [],
      );

      let dataEstab = this.establecimientos.find((estab) => estab.defaultEstab);
      this.puntosEmision = dataEstab?.puntosEmision ?? [];
      let dataPuntoEmision = this.puntosEmision.find(
        (ptoEmi) => ptoEmi.defaultPtoEmi,
      );
      this.dataSearch.idEstablecimiento = dataEstab?.idEstablecimiento ?? 0;
      this.dataSearch.idPuntoEmision = dataPuntoEmision?.idPuntoEmision ?? 0;

      if (this.estadosDoc.length > 0) {
        this.dataSearch.codEstado = estadosDoc.find(
          (estado: any) => estado.codigo === CODE_ESTADO.NCBR,
        )?.codigo;
      }

      const dataTipoDoc = this.tiposDoc.find(
        (tipoDoc) => tipoDoc.codigo === DOC_TYPE.CDV,
      );
      this.dataSearch.codDoc = dataTipoDoc.codigo;
    });
  }

  ngOnInit() {
    this.getDataFilter();
  }

  onChangeTipoDoc() {
    console.log(this.dataSearch.codDoc);
    this.isSelectedNotaEntrega = this.dataSearch.codDoc !== DOC_TYPE.FV;
  }

  onChangeEstab() {
    let dataEstab = this.establecimientos.find(
      (estab) => estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    if (dataEstab) {
      this.puntosEmision = dataEstab.puntosEmision;
      this.dataSearch.idPuntoEmision = 0;
    } else {
      this.puntosEmision = [];
      this.dataSearch.idPuntoEmision = 0;
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  resultEmptyInputCustomer() {
    this.dataSearch.companyCustomerId = 0;
    this.dataSearch.identificacion = null;
  }

  onCustomerSelected({ data }: any) {
    this.dataSearch.identificacion = data.numeroIdentificacion;
    this.dataSearch.companyCustomerId = data.idCliente;
  }

  emptyInputUser() {
    this.dataSearch.userId = 0;
  }

  onUserSelected({ data }: any) {
    this.dataSearch.userId = data.idUsuario;
  }

  getReportPdf() {
    this.format = FORMAT_REPORT.PDF;
    this.getReport();
  }

  getReportExcel() {
    this.format = FORMAT_REPORT.EXCEL;
    this.getReport();
  }

  getReport() {
    try {
      if (
        this.dataSearch.checkBoxCustomer &&
        !isValidField(this.dataSearch.identificacion)
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Cliente',
        });
        return;
      }
      if (
        this.dataSearch.checkBoxUser &&
        !isValidField(this.dataSearch.userId)
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Usuario',
        });
        return;
      }
      let dataEstab = this.establecimientos.find(
        (estab) =>
          estab.idEstablecimiento === this.dataSearch.idEstablecimiento,
      );
      let dataEstado = this.estadosDoc.find(
        (estado) => estado.idEstadoPago === this.dataSearch.idEstadoDocumento,
      );

      let identificacion = this.dataSearch.checkBoxCustomer
        ? isValidField(this.dataSearch.identificacion)
        : null;
      let idUsuario = this.dataSearch.checkBoxUser
        ? isValidField(this.dataSearch.userId)
        : null;
      let idCliente = this.dataSearch.checkBoxCustomer
        ? isValidField(this.dataSearch.companyCustomerId)
        : null;

      let dataParams = {
        tipo: 2,
        ckFecha: true,
        codDoc: this.getTipoDoc(),
        codEstab: (dataEstab && dataEstab.codEstab) || null,
        codEstado: (dataEstado && dataEstado.codigo) || null,
        fechaInicio: this.dataSearch.fromDate,
        fechaFin: this.dataSearch.toDate,
        identificacion,
        idUsuario,
        idCliente,
        convertToDoc: this.dataSearch.convertToDoc,
        idCiudad: this.dataSearch.idCiudad,
      };

      let reportParams = JSON.stringify({
        hasParams: false,
        codigo: SALE_CODE_REPORT.FG,
        format: this.format,
      });

      const parameters = {
        reportParams,
        dataParams: JSON.stringify(dataParams),
      };
      this.sharedSvc.getReport({
        data: parameters,
        format: this.format,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getTipoDoc() {
    if (this.dataSearch.codDoc === DOC_TYPE.FV) return DOC_TYPE_SRI.F;
    if (this.dataSearch.codDoc === DOC_TYPE.CDV) return null;
    return this.dataSearch.codDoc;
  }
}
