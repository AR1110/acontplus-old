import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FraccProductList } from '@inventory/ui/fractional-product/components/fracc-product-list/fracc-product-list';

@Component({
  selector: 'app-fracc-product',
  imports: [BreadcrumbComponent, FraccProductList],
  templateUrl: './fracc-product-page.html',
  styles: ``,
})
export class FraccProductPage {}
