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

@Component({
  selector: 'app-movimiento-caja-report-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    EmployeeSearchComponent
  ],
  templateUrl: './movimiento-caja-report-page.component.html',
  styles: ``
})
export class MovimientoCajaReportPageComponent {

  isShowCompanyCustomer = false;
  isShowEmployee = true;
  sharedSvc = inject(SharedService)


  establecimientos: EstablecimientoSelectHtmlOnly[]= []

  dataSearch = {
    codEstab: null as string | null | undefined
  }
  ngOnInit(){
    this.sharedSvc.getEstabAsign().subscribe(response=>{
      this.establecimientos = response;
      this.dataSearch.codEstab = this.establecimientos.find(e=>e.predeterminado)?.codEstab
    })
  }

}
