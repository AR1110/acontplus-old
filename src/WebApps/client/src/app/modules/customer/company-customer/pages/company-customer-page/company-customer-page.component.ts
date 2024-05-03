import { CommonModule } from '@angular/common';
import {  Component  } from '@angular/core';
import { CompanyCustomerAddEditDirective } from '@company-customer/directives/company-customer-add-edit.directive';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-company-customer-page',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BreadcrumbComponent,
    CompanyCustomerAddEditDirective
  ],
  templateUrl: './company-customer-page.component.html',
})
export class CompanyCustomerPageComponent   {

  ngOnInit(): void { }

}
