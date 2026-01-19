import { Component, ViewChild } from '@angular/core';
import { RoleListComponent } from './components/role-list/role-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-role-page',
    templateUrl: './role-page.component.html',
    styles: ``,
    imports: [RoleListComponent, BreadcrumbComponent]
})
export class RolePageComponent {
  @ViewChild(RoleListComponent) child!: RoleListComponent;
}
