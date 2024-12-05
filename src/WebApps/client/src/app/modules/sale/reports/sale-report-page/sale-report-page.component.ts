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
import { ToasterService } from '@core/services/toaster.service';
import { SharedService } from '@core/services/shared.service';
import { isValidField } from '@core/utils/utils';
import { SALE_CODE_REPORT } from '@sale/enums/sale.enum';
import { formatDateToString } from '@core/utils/date.util';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { CompanyCustomerSearchMatComponent } from '@company-customer/components/company-customer-search-mat/company-customer-search-mat.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatUserSearchComponent } from '@shared/components/mat-user-search/mat-user-search.component';
import Swal from 'sweetalert2';
import { NotificacionService } from '@shared/services/notificacion.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { ActionEnviarCorreoDirective } from '@shared/directives/permission/action-enviar-correo.directive';
import { ActionReportDirective } from '@shared/directives/permission/action-report.directive';

const imports = [
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDividerModule,
  FormsModule,
  MatButtonModule,
  MatIconModule,
  BreadcrumbComponent,
  CompanyCustomerSearchMatComponent,
  DateRangeSelectionComponent,
  MatUserSearchComponent,

  //Directives
  ActionEnviarCorreoDirective,
  ActionReportDirective
]
@Component({
    selector: 'app-sale-report-page',
    imports,
    templateUrl: './sale-report-page.component.html',
    styles: ``
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
    codEstado: 0 as string | null | number,
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
  private appNotifiSvc = inject(NotificacionService)
  private authSvc = inject(AuthService)

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

  onCustomerSelected(data: any) {
    this.dataSearch.identificacion = data.numeroIdentificacion;
    this.dataSearch.companyCustomerId = data.idCliente;
  }

  emptyInputUser() {
    this.dataSearch.userId = 0;
  }

  onUserSelected(data: any) {
    this.dataSearch.userId = data.idUsuario;
  }



  getTipoDoc() {
    if (this.dataSearch.codDoc === DOC_TYPE.FV) return DOC_TYPE_SRI.F;
    if (this.dataSearch.codDoc === DOC_TYPE.CDV) return null;
    return this.dataSearch.codDoc;
  }


  private getDataParams (){
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

      userRoleId: this.authSvc.getUserRoleId()
    };
    return dataParams;

  }

  private isValidDataSearch(){
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
    return true;
  }

  getReport() {
    try {

      if(!this.isValidDataSearch()) return

      let reportParams = JSON.stringify({
        hasParams: false,
        codigo: SALE_CODE_REPORT.FG,
        format: this.format,
      });

      const parameters = {
        reportParams,
        dataParams: JSON.stringify(this.getDataParams()),
        hasService: true
      };
      this.sharedSvc.getReport({
        data: parameters,
        format: this.format,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getReportPdf() {
    this.format = FORMAT_REPORT.PDF;
    this.getReport();
  }

  getReportExcel() {
    this.format = FORMAT_REPORT.EXCEL;
    this.getReport();
  }


  async askToSendMail(){

    if(!this.isValidDataSearch()) return


    let {isConfirmed} = await Swal.fire({
      icon: 'warning',
      html: '¿Estás seguro de enviar el reporte por correo electrónico de la empresa?',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      showConfirmButton: true
    })


    if(!isConfirmed) return

     const params = {
        subject: 'Reporte Ventas',
        params: {
          hasFile: true,
          isReport: "SI",
          reportParams: {
            hasParams: false,
            codigo:SALE_CODE_REPORT.FG,
            format: FORMAT_REPORT.PDF
          },
          spParams:  this.getDataParams(),
          withTableNames: true,
        },
        codigo:SALE_CODE_REPORT.FG,

      }


      this.appNotifiSvc.post(params).subscribe( (response) =>{
        if(response.code==="0"){
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if(response.code==="1"){
          this.tS.toastr({
            type: 'success',
            message: response.message
          })
        }
      })

  }


}
