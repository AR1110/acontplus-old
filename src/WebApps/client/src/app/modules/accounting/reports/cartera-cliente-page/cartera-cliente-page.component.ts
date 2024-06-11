import {Component, inject} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {CuentaPorCobrarService} from "@accounting/services/cuenta-por-cobrar.service";
import {FormsModule} from "@angular/forms";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {CODE_ESTADO, DOC_TYPE, DOC_TYPE_SRI, FORMAT_REPORT} from "@core/constants/global.constants";
import {ToasterService} from "@core/services/toaster.service";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {
  CompanyCustomerSearchComponent
} from "@company-customer/components/company-customer-search/company-customer-search.component";
import {formatDateMoment} from "@core/utils/format-date-moment";
import {isValidField} from "@core/utils/utils";
import {ACCOUNTING_CODE_REPORT} from "@accounting/enums/accounting.constants";
import {SharedService} from "@core/services/shared.service";

@Component({
  selector: 'app-cartera-cliente-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent
  ],
  templateUrl: './cartera-cliente-page.component.html',
  styles: ``
})
export class CarteraClientePageComponent {
  private cuentaPorCobrarSvc = inject(CuentaPorCobrarService)
  private tS = inject(ToasterService)
  private sharedSvc = inject(SharedService)

  isSelectedNotaEntrega = false;
  dataSearch = {
    ckFecha: false,
    checkboxCompanyCustomer: false,
    ckCxcVencida: false,
    ckCuotas: false,
    codEstab: '',
    idPuntoEmision: 0,
    codEstado: null as string | null,
    codDoc: null as string|null,
    idEmpresa: 0,
    convertToDoc: false,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    companyCustomerId: 0
  }

  establecimientos: GroupedEstab[]=[];
  puntosEmision: GroupedEstabPuntoEmision[]=[];
  estadosDoc:any[]=[]
  tiposDoc:any[]=[]
  empresas:any[]=[]

  format:any;

  getDataFilter(){
    this.cuentaPorCobrarSvc.getDataFilter().subscribe(response=>{
 
      const { estabs, estadosDoc, tiposDoc, empresas } = response;

      this.establecimientos = estabs;
      this.estadosDoc = estadosDoc;
      this.tiposDoc = tiposDoc;
      this.empresas = empresas;

      let dataEstab = this.establecimientos.find((estab) => estab.defaultEstab);
      this.puntosEmision = dataEstab?.puntosEmision ?? []
      let dataPuntoEmision = this.puntosEmision.find((ptoEmi) => ptoEmi.defaultPtoEmi);
      this.dataSearch.codEstab = dataEstab?.codEstab ??'';
      this.dataSearch.idPuntoEmision = dataPuntoEmision?.idPuntoEmision ?? 0

      if (this.estadosDoc.length > 0) {
        this.dataSearch.codEstado = estadosDoc.find((estado:any) => estado.codigo === CODE_ESTADO.NCBR)?.codigo
      }
    })
  }

  ngOnInit(){
    this.getDataFilter()
  }


  onChangeEstab ()  {
    let dataEstab = this.establecimientos.find((estab) => estab.codEstab === this.dataSearch.codEstab);
    this.puntosEmision = dataEstab?.puntosEmision ?? []
    if (this.puntosEmision.length > 0) {
      this.dataSearch.idPuntoEmision =this.puntosEmision.find((pto) => pto.defaultPtoEmi)?.idPuntoEmision ?? 0
    } else {
      this.tS.toastr({
        type: 'warning',
        message: 'No tienes asignados puntos de emisión!'
      })
      this.dataSearch.idPuntoEmision = 0;
    }
  };


  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }


  resultEmptyInputCustomer(){
    this.dataSearch.companyCustomerId = 0;
  }
  onCustomerSelected({data}:any){
    this.dataSearch.companyCustomerId=data.idCliente;
  }

  onChangeTipoDoc(){
    this.isSelectedNotaEntrega = this.dataSearch.codDoc===DOC_TYPE.NE
  }



  getReportPdf(){
    this.format = FORMAT_REPORT.PDF;
    this.getReport()
  }

  getReportExcel(){
    this.format = FORMAT_REPORT.EXCEL;
    this.getReport()
  }

  private getTipoDoc  () {
    if (this.dataSearch.codDoc === DOC_TYPE.FV) {
      return DOC_TYPE_SRI.F;
    }
    return this.dataSearch.codDoc
  }

  private getReport(){
    if (this.dataSearch.checkboxCompanyCustomer) {
      if (!(this.dataSearch.companyCustomerId > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Cliente'
        });
        return
      }
    }

    let idCliente = this.dataSearch.checkboxCompanyCustomer? isValidField(this.dataSearch.companyCustomerId) : null
    let idEmpresa = this.dataSearch.idEmpresa > 0 ? this.dataSearch.idEmpresa: null;
    let dataParams = {
      tipo: 1,
      ckFecha: this.dataSearch.ckFecha,
      codEstab: this.dataSearch.codEstab,
      idCliente,
      codEstado: isValidField(this.dataSearch.codEstado),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      ckCxcVencida: this.dataSearch.ckCxcVencida,
      ckCuotas: this.dataSearch.ckCuotas,
      codDoc: isValidField(this.getTipoDoc()),
      idEmpresa,
      convertToDoc: this.dataSearch.convertToDoc
    };


    let  reportParams = JSON.stringify({
      hasParams: false,
      codigo: this.dataSearch.ckCuotas ? ACCOUNTING_CODE_REPORT.CCCR : ACCOUNTING_CODE_REPORT.CCR,
      format: this.format,
      aditionalParams: []
    })

    const parameters = {
      hasIdUsuarioRol: true,
      reportParams,
      dataParams: JSON.stringify(dataParams)
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: this.format,

    })

  }

}
