import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [BreadcrumbComponent, MatTab, MatTabGroup],
  templateUrl: './products-page.component.html',
  styles: ``,
})
export class ProductsPageComponent {
  onTabChange($event: MatTabChangeEvent) {}
}
