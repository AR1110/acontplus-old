import {Component, inject} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {
  CompanyCustomerSearchComponent
} from "@company-customer/components/company-customer-search/company-customer-search.component";
import {EmployeeSearchComponent} from "@sale/components/employee-search/employee-search.component";
import {SharedService} from "@core/services/shared.service";
import {EstablecimientoSelectHtmlOnly} from "@core/models/estab.model";
import {FormsModule} from "@angular/forms";
import {formatDateMoment} from "@core/utils/format-date-moment";
import {FORMAT_REPORT} from "@core/constants/global.constants";
import {isValidField} from "@core/utils/utils";
import {ToasterService} from "@core/services/toaster.service";
import {ACCOUNTING_CODE_REPORT} from "@accounting/enums/accounting.constants";
import {UserSearchComponent} from "@core/components/user-search/user-search.component";

@Component({
  selector: 'app-movimiento-caja-report-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    EmployeeSearchComponent,
    UserSearchComponent
  ],
  templateUrl: './movimiento-caja-report-page.component.html',
  styles: ``
})
export class MovimientoCajaReportPageComponent {

  isShowCompanyCustomer = false;
  isShowEmployee = true;
  sharedSvc = inject(SharedService)
  tS = inject(ToasterService)


  tiposDoc = [
    {codDoc: 'MC', descripcion: 'Movimiento Caja'},
    {codDoc: 'A', descripcion: 'Anticipo'},
  ]
  establecimientos: EstablecimientoSelectHtmlOnly[]= []

  dataSearch = {
    codEstab: null as string | null | undefined,
    codDoc: "MC" as string | null,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    companyCustomerId: 0,
    employeeId: 0,
    format: '',
    checkboxCompanyCustomerEmployee: false,
    checkboxUser: false,
    userId: 0
  }
  ngOnInit(){
    this.sharedSvc.getEstabAsign().subscribe(response=>{
      this.establecimientos = response;
      this.dataSearch.codEstab = this.establecimientos.find(e=>e.predeterminado)?.codEstab
    })
  }

  onChangeTipoDoc (){
    if(this.dataSearch.codDoc==='A'){
      this.isShowCompanyCustomer = true;
      this.isShowEmployee = false;
      this.dataSearch.employeeId = 0;
    }
    if(this.dataSearch.codDoc==='MC'){
      this.isShowCompanyCustomer = false;
      this.isShowEmployee = true;
      this.dataSearch.companyCustomerId = 0;
    }
  }

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


  onEmployeeSelected({data}:any){
    this.dataSearch.employeeId = data.idEmpleado;
  }
  emptyInputEmployee(){
    this.dataSearch.employeeId = 0
  }

  emptyInputUser(){
    this.dataSearch.userId = 0;
  }

  onUserSelected({data}:any){
    this.dataSearch.userId = data.idUsuario;
  }
  getReportPdf(){
    this.dataSearch.format = FORMAT_REPORT.PDF;
    this.getReport()
  }

  getReportExcel(){
    this.dataSearch.format = FORMAT_REPORT.EXCEL;
    this.getReport()
  }


  protected getReport(){

    if(!isValidField(this.dataSearch.codEstab)){
      this.tS.toastr({
        type: 'warning',
        message: 'Establecimiento es requerido!'
      })
      return
    }

    if(!isValidField(this.dataSearch.codDoc)){
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el tipo documento!'
      })
      return
    }

    if(this.dataSearch.checkboxCompanyCustomerEmployee){
      if(!((this.dataSearch.companyCustomerId>0) || (this.dataSearch.employeeId>0))){
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el cliente/empleado!'
        })
        return
      }
    }

    if(this.dataSearch.checkboxUser){
      if(!(this.dataSearch.userId)){
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el usuario!'
        })
        return
      }
    }

    let companyCustomerId = this.dataSearch.checkboxCompanyCustomerEmployee && this.dataSearch.companyCustomerId || 0 ;
    let employeeId = this.dataSearch.checkboxCompanyCustomerEmployee && this.dataSearch.employeeId  || 0;
    let userId = this.dataSearch.checkboxUser && this.dataSearch.userId || 0

    const dataParams = {
      codEstab: this.dataSearch.codEstab,
      tipoDoc: this.dataSearch.codDoc,
      checkBoxCliente: companyCustomerId > 0 && this.dataSearch.checkboxCompanyCustomerEmployee ,
      idCliente: companyCustomerId > 0 ? companyCustomerId : null,
      checkBoxEmpleado: employeeId > 0 && this.dataSearch.checkboxCompanyCustomerEmployee,
      idEmpleado: employeeId || null,
      checkBoxUsuario: this.dataSearch.checkboxUser,
      idUsuario: userId || null,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,

    }

    let reportParams = JSON.stringify({
      codEstab: this.dataSearch.codEstab,
      hasParams: true,
      codigo: ACCOUNTING_CODE_REPORT.RMC,
      format: this.dataSearch.format,
      aditionalParams: []
    })
    const parameters = {
      reportParams,
      dataParams: JSON.stringify(dataParams)
    }


    this.sharedSvc.getReport({
      data: parameters,
      format: this.dataSearch.format,
      isOldVersion: true
    })

  }


}
