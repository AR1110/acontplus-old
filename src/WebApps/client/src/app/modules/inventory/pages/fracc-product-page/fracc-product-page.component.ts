import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FraccProductListComponent } from '@inventory/product/components/fracc-product-list/fracc-product-list.component';

@Component({
    selector: 'app-fracc-product-page',
    imports: [
        BreadcrumbComponent,
        FraccProductListComponent
    ],
    templateUrl: './fracc-product-page.component.html',
    styles: ``
})
export class FraccProductPageComponent {

}
