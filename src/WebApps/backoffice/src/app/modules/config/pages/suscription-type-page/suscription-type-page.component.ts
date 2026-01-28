import { Component, ViewChild, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { SuscriptionTypeListComponent } from './suscription-type-list/suscription-type-list.component';

@Component({
    selector: 'app-suscription-type-page',
    templateUrl: './suscription-type-page.component.html',
    styles: ``,
    imports: [BreadcrumbComponent, SuscriptionTypeListComponent]
})
export class SuscriptionTypePageComponent {
  @ViewChild(SuscriptionTypeListComponent) child!: SuscriptionTypeListComponent;
}
