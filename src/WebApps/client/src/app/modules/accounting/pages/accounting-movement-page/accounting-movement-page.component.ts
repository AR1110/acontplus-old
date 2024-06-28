import { Component, inject } from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {AccountingMovementService} from "@accounting/services/accounting-movement.service";
import { SubCategorySelectHtmlOnly } from '@modules/accounting/models/subcategory';
import { FormsModule } from '@angular/forms';
import { formatDateToString } from '@core/utils/date.util';
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {FORMAT_REPORT, TIPO_TRANSACCION } from '@core/constants/global.constants';
import {SharedService} from "@core/services/shared.service";
import {getValidId} from "@core/utils/utils";
import {ACCOUNTING_CODE_REPORT} from "@accounting/enums/accounting.constants";

@Component({
  selector: 'app-accounting-movement-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent
  ],
  templateUrl: './accounting-movement-page.component.html',
  styles: ``
})
export class AccountingMovementPageComponent {
  private accountingSummarySvc  = inject(AccountingMovementService);
  private sharedSvc = inject(SharedService)
   subcategories: SubCategorySelectHtmlOnly[]=[]
   transactionTypes:any[]=[];
  
   private format = '';
   
   dataSearch = {
     idTipoTransaccion: 0,
     fromDate: formatDateToString(new Date()) ,
     toDate: formatDateToString(new Date()) ,
     idSubcategoria: 0
   }
  getDataFilter(){
    this.accountingSummarySvc.getDataFilter().subscribe(response=>{
      this.subcategories = response.subCategories;
      this.transactionTypes = response.transactionTypes;
      console.log(this.subcategories)
      let dataTipoTransaccion = this.transactionTypes.find(tt=>tt.codigo===TIPO_TRANSACCION.V);
      this.dataSearch.idTipoTransaccion = dataTipoTransaccion?.idTipoTransaccion ?? 0;
    })
  }

  ngOnInit(){
    this.getDataFilter()
  }
  
  
  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }
  
  reportPdf(){
    this.format = FORMAT_REPORT.PDF;
    this.getReport()
  }
  
  reportExcel(){
    this.format = FORMAT_REPORT.EXCEL;
    this.getReport()
  }
   
 

  private getReport(){
     
    
    let dataParams = {
      tipo: 1,
      ckFecha: true,
      tipoTransaccionId: getValidId(this.dataSearch.idTipoTransaccion),
      subCategoryId : getValidId(this.dataSearch.idSubcategoria)
    };


    let  reportParams = JSON.stringify({
      hasParams: false,
      codigo: ACCOUNTING_CODE_REPORT.AM,
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
